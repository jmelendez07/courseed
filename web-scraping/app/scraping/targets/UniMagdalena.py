from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from app.persistence.documents.Content import Content
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
import re

class UniMagdalena(BaseScraper):
    INSTITUTION: str = "Universidad del Magdalena"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            facultyTabMenu = self.driver.find_element(By.XPATH, '//a[@class="elementor-item elementor-item-anchor has-submenu" and contains(text(), "Todas las Facultades")]')
            self.driver.execute_script("arguments[0].click();", facultyTabMenu)

            faculties = [{ "url": faculty.get_attribute("href"), "name": faculty.text.lower() } for faculty in self.driver.find_elements(By.XPATH, '//ul[@class="sub-menu elementor-nav-menu--dropdown sm-nowrap"]/li/a[@class="elementor-sub-item"]')]

            for faculty in faculties:
                self.logger.info(f"Loading the faculty URL: {faculty["url"]}")
                self.driver.get(faculty["url"])

                courseData: list[str] = []

                while True:
                    try:
                        courseCards = WebDriverWait(self.driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, '//h3[@class="elementor-post__title"]/a')))
                        for courseCard in courseCards:
                            courseData.append({ "url": courseCard.get_attribute("href"), "title": courseCard.text })

                        newPage = self.driver.find_element(By.XPATH, '//*[@class="page-numbers current"]/following-sibling::a').get_attribute("href")
                        self.driver.get(newPage)

                    except NoSuchElementException:
                        break
                
                for courseElement in courseData:
                    course = self.getCourse(courseUrl=courseElement["url"], title=courseElement["title"], category=faculty["name"])
                    if course:
                        courses.append(course)
            
            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None            

    def getCourse(self, courseUrl: str, title: str, category: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)

            image = None
            try:
                image = self.driver.find_element(By.XPATH, '//meta[@property="og:image"]').get_attribute("content")
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            description = None
            try:
                description = self.cleanText(self.driver.find_element(By.XPATH, '//div[contains(@class, "bb-elementor-custom-line-height")]').text)
                description = f"{description[:2000-3]}..." if len(description) > 2000 else description
                description = None if description.strip() == "" else description
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")
                
            prerequisites = None
            price = None
            try:
                priceElement = self.driver.find_element(By.XPATH, '//strong[contains(text(), "Valor:")]//ancestor::span[1]')
                priceMatch = re.search(r'\s*\$\s*([\d,\.]+)', priceElement.text).group(1)
                price = float(priceMatch.replace('$', '').replace('.', '').replace(',', '.').strip())
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            duration = None
            try:
                durationElement = self.driver.find_element(By.XPATH, '//strong[contains(text(), "Duración:")]//ancestor::span[1]')
                duration = self.cleanText(durationElement.text.replace("Duración:", ""))
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            modality = None
            try:
                modalityElement = self.driver.find_element(By.XPATH, '//strong[contains(text(), "Modalidad:")]//ancestor::span[1]')
                modality = self.cleanText(modalityElement.text.replace("Modalidad:", ""))
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            contents: list[str] = []
            try:
                contentElements = self.driver.find_elements(By.XPATH, '//div[contains(@class, "elementor-button-wrapper")]//span[@class="elementor-button-text"]')
                for contentElement in contentElements[:10]:
                    content = self.cleanText(contentElement.text)
                    if content:
                        contents.append(content)
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            course = CourseInteface(
                url=courseUrl,
                title=title,
                image=image,
                description=description,
                prerequisites=prerequisites,
                price=price,
                duration=duration,
                modality=modality,
                institution=self.INSTITUTION,
                category=category,
                contents=contents
            )

            self.logger.info(f"Successfully retrieved course information from URL: {course.url}")
            return course

        except Exception as e:
            self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")
            return None
        finally:
            self.driver.back()

    def cleanText(self, text: str) -> str:
        cleanedText = re.sub(r'[\t\n\xa0]', ' ', text).strip()
        return cleanedText

    def saveToDatabase(self, courses: list[CourseInteface]):
        for course in courses:
            try:
                institutionDocument = Institution.objects(name=course.institution).modify(upsert=True, set__name=course.institution, new=True)
                categoryDocument = Category.objects(name=course.category).modify(upsert=True, set__name=course.category, new=True)
                courseDocument = Course.objects(url=course.url).modify(
                    upsert=True, 
                    set__url=course.url,
                    set__title=course.title,
                    set__image=course.image,
                    set__description=course.description,
                    set__prerequisites=course.prerequisites,
                    set__price=course.price,
                    set__duration=course.duration,
                    set__modality=course.modality,
                    set__categoryId=str(categoryDocument.id),
                    set__institutionId=str(institutionDocument.id),
                    new=True
                )

                for content in course.contents:
                    Content.objects(courseId=str(courseDocument.id), description=content).modify(
                        upsert=True, 
                        set__courseId=str(courseDocument.id),
                        set__description=str(content),
                        new=True
                    )

                self.logger.info(f"Course successfully saved in the database. URL: {courseDocument.url}, ID: {str(courseDocument.id)}")
            except Exception as e:
                self.logger.error(self.logger.error(f"Failed to save course in the database. URL: {course.url}. Exception: {str(e)}"))

