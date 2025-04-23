from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from app.persistence.documents.Content import Content
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import re

class AutonomaDeOccidente(BaseScraper):
    INSTITUTION: str = "universidad autónoma de occidente"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            courseUrls: list[str] = []

            while True:
                try:
                    courseElements = self.driver.find_elements(By.XPATH, '//div[@class="tc-cards-container"]/div[contains(@class, "virtual-program-card")]/a')
                    for courseElement in courseElements:
                        courseUrls.append(courseElement.get_attribute("href"))

                    newPage = self.driver.find_element(By.XPATH, '//div[@class="pagination"]/a[@class="next"]').get_attribute("href")
                    self.driver.get(newPage)

                except NoSuchElementException:
                    break

            print(len(courseUrl))

            for courseUrl in courseUrls:
                course = self.getCourse(courseUrl)
                if course:
                    courses.append(course)

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None
           
    def getCourse(self, courseUrl: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)

            title = self.cleanText(self.driver.find_element(By.XPATH, '//div[@class="virtual-program-detail"]//h1').text)

            image = None 
            try:
                image = self.driver.find_element(By.XPATH, '//img[@class="attachment-large size-large wp-post-image"]').get_attribute("src")
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            description = None
            try:
                description = self.cleanText(self.driver.find_element(By.XPATH, '//div[@class="detail-content virtual-program-detail-content"]/h2[contains(text(), "¿Por qué hacerlo?") or contains(text(), "¿Por qué tomar el Curso?")]/following-sibling::p').text)
                description = f"{description[:2000-3]}..." if len(description) > 2000 else description
                description = None if description.strip() == "" else description
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            prerequisites = None

            detailsElement = self.driver.find_element(By.XPATH, '//div[@class="virtual-program-details aos-init"]')
            self.driver.execute_script("arguments[0].scrollIntoView();", detailsElement)
            WebDriverWait(self.driver, 10).until(EC.visibility_of(detailsElement))

            price = None
            try: 
                priceElement = self.driver.find_element(By.XPATH, '//p[contains(text(), "Valor del curso")]//ancestor::div[1]//*[@class="term"]') 
                priceMatch = re.search(r'\s*\$\s*([\d,\.]+)', priceElement.text).group(1)
                price = float(priceMatch.replace('$', '').replace('.', '').replace(',', '.').strip())
            except Exception as e:
                pass
                
            if not price:
                try:
                    priceElement = self.driver.find_element(By.XPATH, '//p[contains(text(), "Valor periodo académico")]//following-sibling::*')
                    priceMatch = re.search(r'\s*\$\s*([\d,\.]+)', priceElement.text).group(1)
                    price = float(priceMatch.replace('$', '').replace('.', '').replace(',', '.').strip())
                except Exception as e:
                    self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            duration = None
            try:
                duration = self.cleanText(self.driver.find_element(By.XPATH, '//p[contains(text(), "Duración del curso") or contains(text(), "Duración del programa")]//following-sibling::*').text)
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            modality = None
            try:
                modality = self.cleanText(self.driver.find_element(By.XPATH, '//p[contains(text(), "Modalidad")]//following-sibling::*').text)
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            category = None
            try:
                category = self.normalize_string(self.cleanText(self.driver.find_element(By.XPATH, '//div[@class="field-of-study"]//p').text))
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            contents: list[str] = [] 
            try:
                contentElements = self.driver.find_elements(By.XPATH, '//div[@class="detail-content virtual-program-detail-content"]/h2[contains(text(), "¿Qué vas a aprender?") or contains(text(), "Habilidades que vas a adquirir")]/following-sibling::ul/li')
                for contentElement in contentElements:
                    content = self.cleanText(contentElement.text)
                    if  content != "":
                        contents.append(content)
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            type = None

            if "diplomado" in title.lower():
                type = "diplomado"
            elif "seminario" in title.lower(): 
                type = "seminario"
            elif "taller" in title.lower():
                type = "taller"
            else: 
                type = "curso"

            course = CourseInteface(
                url=courseUrl,
                title=title,
                image=image,
                description=description,
                prerequisites=prerequisites,
                price=price,
                duration=duration,
                modality=modality,
                type=type,
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
    
    def normalize_string(self, text: str) -> str:
        text = text.lower()
        resultado = []
        alphabet = "abcdefghijklmnñopqrstuvwxyz"
        replaces = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
            'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
            'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u'
        }

        for character in text:
            if character in replaces:
                resultado.append(replaces[character])
            elif character in alphabet:
                resultado.append(character)
            elif character.isspace():
                resultado.append(character)
        
        return ''.join(resultado)

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

