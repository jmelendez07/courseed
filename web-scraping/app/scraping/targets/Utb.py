from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from typing import Optional
from app.persistence.documents.Content import Content
import re

class Utb(BaseScraper):

    INSTITUTION: str = "universidad tecnológica de bolívar"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)
            
            selectElement = self.driver.find_element(By.NAME, "_sft_facultad[]")
            select = Select(selectElement)
            categories = [
                {
                    "url": f"{self.driver.current_url}/?_sft_facultad={option.get_attribute("value")}",
                    "name": self.normalize_string(self.cleanText(option.text))
                }
                for option in select.options if option.get_attribute("value")
            ]

            for category in categories:
                self.logger.info(f"Loading the category URL: {category["url"]}")
                self.driver.get(category["url"])

                containerElement = self.driver.find_element(By.CLASS_NAME, "jet-listing-grid__items")
                courseElements = containerElement.find_elements(By.XPATH, "./*")
                courseUrls = [course.find_element(By.TAG_NAME, "a").get_attribute("href") for course in courseElements]

                for courseUrl in courseUrls:
                    course = self.getCourse(courseUrl=courseUrl, categoryName=category["name"])
                    if course:
                        courses.append(course)

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None

    def getCourse(self, courseUrl: str, categoryName: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)

            title = self.cleanText(self.driver.find_element(By.CSS_SELECTOR, "h1.elementor-heading-title.elementor-size-default").text)
            image = self.driver.find_element(By.CSS_SELECTOR, "div.elementor-widget.elementor-widget-image[data-element_type='widget'][data-widget_type='image.default'] img.attachment-full.size-full").get_attribute("src")

            description = None

            try:
                headerDescription = self.driver.find_element(By.XPATH, "//div[@class='jet-accordion__inner']//div[@class='jet-toggle__label-text' and contains(text(), 'Por qué estudiar')]")
                headerDescription.click()

                descriptionPElements = WebDriverWait(self.driver, 10).until(
                    EC.visibility_of_all_elements_located((By.XPATH, 
                        "//div[@class='jet-accordion__inner']//div[@class='jet-toggle__label-text' and contains(text(), 'Por qué estudiar')]//ancestor::div[2]//div[@class='jet-toggle__content']//div[@class='jet-toggle__content-inner']//p"))
                )

                description = self.cleanText(" ".join([p.text.strip() for p in descriptionPElements]))
                description = f"{description[:2000-3]}..." if len(description) > 2000 else description
                description = None if description.strip() == "" else description
            except ElementNotVisibleException as e:
                pass

            prerequisites = None
            price = None

            try:
                priceText = self.driver.find_element(By.XPATH, "//b[contains(text(), 'Inversión')]//ancestor::span[1]").text

                if "Precio Full:" in priceText:
                    price = re.search(r"Precio Full:\s*\$\s*([\d,\.]+)", priceText)
                    if price:
                        price = self.getPrice(priceText=price.group(1))
                elif "No afiliado:" in priceText:
                    price = re.search(r"No afiliado:\s*\$\s*([\d,\.]+)", priceText)
                    if price:
                        price = self.getPrice(priceText=price.group(1))
                elif "Público externo:" in priceText:
                    price = re.search(r"Público externo:\s*\$\s*([\d,\.]+)", priceText)
                    if price:
                        price = self.getPrice(priceText=price.group(1))
                elif "Inversión:" in priceText:
                    price = re.search(r"Inversión:\s*\$\s*([\d,\.]+)", priceText)
                    if price:
                        price = self.getPrice(priceText=price.group(1))

            except NoSuchElementException:
                pass

            duration = None

            try:
                duration = self.driver.find_element(By.XPATH, "//b[contains(text(), 'Duración')]//ancestor::span[1]").text
                duration = self.cleanText(duration.replace("Duración:", ""))
            except NoSuchElementException:
                pass
            
            modality = self.driver.find_element(By.XPATH, "//b[contains(text(), 'Modalidad')]//ancestor::span[1]").text
            modality = self.cleanText(modality.replace("Modalidad:", ""))

            contents = []

            try:
                headerContent = self.driver.find_element(By.XPATH, "//div[@class='jet-toggle__label-text' and contains(text(), 'Objetivos de Estudio')]")
                headerContent.click()

                contentElements = WebDriverWait(self.driver, 10).until(
                    EC.visibility_of_all_elements_located((By.XPATH, 
                        "//div[@class='jet-toggle__label-text' and contains(text(), 'Objetivos de Estudio')]//ancestor::div[2]//div[@class='jet-toggle__content']//div[@class='jet-toggle__content-inner']//li"))
                )

                contents = [self.cleanText(li.text) for li in contentElements if self.cleanText(li.text) != ""]
            except Exception as e:
                pass

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
                category=categoryName,
                contents=contents
            )

            self.logger.info(f"Successfully retrieved course information from URL: {course.url}")
            return course
        except Exception as e:
            self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")
            return None
        finally:
            self.driver.back()

    def getPrice(self, priceText: str) -> Optional[float]:
        price = re.search(r'(\d+(\.\d{1,3})*)', priceText)
        if price:
            return float(price.group(1).replace('.', '').replace(',', '.'))
        return None
    
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
                        set__description=content,
                        new=True
                    )

                self.logger.info(f"Course successfully saved in the database. URL: {courseDocument.url}, ID: {str(courseDocument.id)}")
            except Exception as e:
                self.logger.error(self.logger.error(f"Failed to save course in the database. URL: {course.url}. Exception: {str(e)}"))

