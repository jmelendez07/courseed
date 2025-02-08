from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from app.persistence.documents.Content import Content
from selenium.webdriver.common.by import By
import re

class UniAtlantico(BaseScraper):
    INSTITUTION: str = "Universidad del Atlántico"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            facultyUrls = [facultyElement.get_attribute("href") for facultyElement in self.driver.find_elements(By.XPATH, '//div[contains(@class, "elementor-column elementor-col-33")]//a')]

            for facultyUrl in facultyUrls:
                self.logger.info(f"Loading the Faculty URL: {facultyUrl}")
                self.driver.get(facultyUrl)

                courseUrls = [facultyElement.get_attribute("href") for facultyElement in self.driver.find_elements(By.XPATH, '//div[contains(@class, "elementor-column elementor-col-33")]//a')]
                courseUrls = list(filter(lambda url : not url.endswith(".pdf"), courseUrls))
                for courseUrl in courseUrls:
                    course = self.getCourse(courseUrl=courseUrl, category=self.cleanText(self.getFacultyByUrl(url=facultyUrl)))
                    if course:
                        courses.append(course)

                self.driver.back()

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None            

    def getCourse(self, courseUrl: str, category: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)

            title = self.cleanText(self.driver.find_element(By.XPATH, '//h1[@class="heading"]').text)

            image = None 
            try:
                image = self.driver.find_element(By.XPATH, '//img[contains(@class, "attachment-large size-large")]').get_attribute("src")
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            description = None
            try:
                description = self.cleanText(self.driver.find_element(By.XPATH, '//div[contains(@class, "elementor-inner-column")]//div[contains(@class, "elementor-widget-text-editor")]//p').text)
                description = f"{description[:2000-3]}..." if len(description) > 2000 else description
                description = None if description.strip() == "" else description
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            prerequisites = None
            price = None

            duration = None
            try:
                duration = self.cleanText(self.driver.find_element(By.XPATH, '//p[strong[contains(text(), "Duración (horas):")]]').text.split('\n')[0].split(':')[-1])
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            modality = None
            try:
                modality = self.cleanText(self.driver.find_element(By.XPATH, '//p[strong[contains(text(), "Modalidad")]]').text.split('\n')[1].split(':')[-1])
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            contents: list[str] = []
            try:
                contentElements = self.driver.find_elements(By.XPATH, '//div[contains(@class, "elementor-top-column")]//div[contains(@class, "elementor-widget-text-editor")]//li')
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

    def getFacultyByUrl(self, url: str):
        for word in [self.url, "diplomados", "facultad", "de"]:
            url = url.replace(word, "")
        return url.replace("-", " ").replace("/", " ").lower()
    
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
