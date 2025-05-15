from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from app.persistence.documents.Content import Content
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
from app.lib.utils import standarize_modality, standarize_duration, standarize_category, uploadFile

class UniTecnar(BaseScraper):
    INSTITUTION: str = "fundación universitaria antonio de arévalo"
    INSTITUTION_IMAGE_URL: str = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMR2iJEQ0gsTZbI9cYIxiCB-hafDWZ9fpeJg&s"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            courseData: list[dict] = []

            courseContent = [
                {
                    "title": courseElement.text,
                    "url": courseElement.get_attribute("href")
                }
                for courseElement in self.driver.find_elements(By.XPATH, '//div[@class="programa-link"]//a') 
                if courseElement.get_attribute("href") and self.cleanText(courseElement.text) 
            ]
                    
            for courseData in courseContent:
                course = self.getCourse(title=courseData["title"], courseUrl=courseData["url"])
                if course:
                    courses.append(course)

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None

    def getCourse(self, title: str, courseUrl: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)

            image = None
            try:
                image = self.driver.find_element(By.XPATH, '//img[@class="img-responsive"]').get_attribute("src")
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            description = None
            try:
                descriptionElement = self.driver.find_element(By.XPATH, '//h3[contains(text(), "Descripción")]//following-sibling::*')
                description = self.cleanText(descriptionElement.text)
                description = f"{description[:2000-3]}..." if len(description) > 2000 else description
                description = None if description.strip() == "" else description
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            price = 0

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

            category = None
            try:
                categoryElement = self.driver.find_element(By.XPATH, '//strong[contains(text(), "Facultad:")]//ancestor::span[1]')
                category = self.cleanText(categoryElement.text.replace("Facultad:", "").replace("Facultad de", "")).lower()
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            contents: list[str] = []
            try:
                contentTab = self.driver.find_element(By.XPATH, '//a[@href="#planestudio"]/ancestor::li[1]')
                self.driver.execute_script("arguments[0].scrollIntoView();", contentTab)
                contentTab.click()
                
                contentElements = WebDriverWait(self.driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, '//div[@class="panel-heading"]')))
                
                for contentElement in contentElements:
                    self.driver.execute_script("arguments[0].scrollIntoView();", contentElement)
                    WebDriverWait(self.driver, 10).until(EC.visibility_of(contentElement))

                    content = self.cleanText(contentElement.text)
                    if content:
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
                price=price,
                duration=standarize_duration(duration),
                modality=standarize_modality(modality),
                type=type,
                institution=self.INSTITUTION,
                institution_image_url=self.INSTITUTION_IMAGE_URL,
                category=standarize_category(self.normalize_string(category)),
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
        institutionImage = uploadFile(self.INSTITUTION_IMAGE_URL, "institutions")
        institutionDocument = Institution.objects(name=self.INSTITUTION).modify(upsert=True, set__name=self.INSTITUTION, set__image=institutionImage, new=True)
        
        for course in courses:
            try:
                categoryDocument = Category.objects(name=course.category).modify(upsert=True, set__name=course.category, new=True)
                
                courseImageUrl: str = uploadFile(course.image, "courses")
                courseDocument = Course.objects(url=course.url).modify(
                    upsert=True, 
                    set__url=course.url,
                    set__title=course.title,
                    set__image=courseImageUrl,
                    set__originalImage=course.image,
                    set__description=course.description,
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

