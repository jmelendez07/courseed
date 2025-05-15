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
from app.lib.utils import standarize_modality, standarize_duration, standarize_category, uploadFile

class AutonomaDeOccidente(BaseScraper):
    INSTITUTION: str = "universidad autónoma de occidente"
    INSTITUTION_IMAGE_URL: str = "https://estudiarvirtual.uao.edu.co/wp-content/themes/uao-virtual/assets/favicon/ms-icon-144x144.png"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            courseUrls = []
            courseElements = self.driver.find_elements(By.XPATH, '//div[contains(@class, "program-cards-container")]//a[contains(@class, "program-card")]')
            for courseElement in courseElements:
                courseUrl = courseElement.get_attribute("href")
                if courseUrl not in courseUrls:
                    courseUrls.append(courseUrl)

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

            title = self.cleanText(self.driver.find_element(By.XPATH, '//meta[@property="og:title"]').get_attribute('content'))
            image = self.driver.find_element(By.XPATH, '//meta[@property="og:image"]').get_attribute("content")
            description = self.cleanText(self.driver.find_element(By.XPATH, '//meta[@property="og:description"]').get_attribute("content"))
            price = 0
            try:
                priceText = self.driver.find_element(By.XPATH, '//h5[contains(text(), "Valor periodo académico")]/following-sibling::span').text
                match =  re.search(r'\$?\s*([\d\.,]+)', priceText)
                if match:
                    price = float(match.group(1).replace('.', '').replace(',', '.'))
            except Exception:
                priceText = self.driver.find_element(By.XPATH, '//p[contains(text(), "Valor periodo académico")]/following-sibling::p').text
                cleanedPrice = re.sub(r'[^\d,]', '', priceText).replace(',', '.')
                if cleanedPrice:
                    price = float(cleanedPrice)

            duration = "0 horas"  
            try:
                durationText = self.driver.find_element(By.XPATH, '//h5[contains(text(), "Duración del programa")]/following-sibling::span').text 
                match = re.search(r'\b\d+\s*horas\b', durationText, re.IGNORECASE)
                if match:
                    duration = match.group(0)
            except Exception:
                duration = self.cleanText(self.driver.find_element(By.XPATH, '//p[contains(text(), "Duración del programa")]/following-sibling::p').text)

            modality = None
            try:
                modality = self.cleanText(self.driver.find_element(By.XPATH, '//h5[contains(text(), "Modalidad")]/following-sibling::span').text)  
            except Exception:
                modality = self.cleanText(self.driver.find_element(By.XPATH, '//p[contains(text(), "Modalidad")]/following-sibling::p').text)
                
            category = "sin categoría"
            try:
                category = self.cleanText(self.driver.find_element(By.XPATH, '//div[contains(@class, "field-of-study")]//p').text)
            except Exception:
                category = "sin categoría"

            contents = []
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
                category=standarize_category(category),
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
        self.logger.info(f"Saving {len(courses)} courses to the database.")
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

