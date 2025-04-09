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

class UniAndes(BaseScraper):
    INSTITUTION: str = "universidad de los andes"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            checkboxes = self.driver.find_elements(By.XPATH, '//*[@id="collapsefacu"]//input[@type="checkbox"]')
            faculties = [{ "name": checkbox.get_attribute("name"), "value": checkbox.get_attribute("value") } for checkbox in checkboxes ]

            for faculty in faculties:
                urlWithParam = f"{self.url}?{faculty["name"]}={faculty["value"]}"

                self.logger.info(f"Loading the faculty URL: {urlWithParam}")
                self.driver.get(urlWithParam)

                courseUrls: list[str] = []
                courseElements = self.driver.find_elements(By.XPATH, '//div[@class="module__modulares module__modulares--catalogo"]//a[@class="btn btn-secundary-edco"]')

                for courseElement in courseElements:
                    courseUrls.append(courseElement.get_attribute("href"))
                
                paginationElements = self.driver.find_elements(By.XPATH, '//ul[@class="pagination"]//a[text()[normalize-space()]]')
                paginationUrls = [paginationElement.get_attribute('href') for paginationElement in paginationElements if paginationElement.text.isdigit() and paginationElement.text != "1"]

                for paginationUrl in paginationUrls:
                    self.driver.get(paginationUrl)
                    courseElements = self.driver.find_elements(By.XPATH, '//div[@class="module__modulares module__modulares--catalogo"]//a[@class="btn btn-secundary-edco"]')

                    for courseElement in courseElements:
                        courseUrls.append(courseElement.get_attribute("href"))

                for courseUrl in courseUrls:
                    course = self.getCourse(courseUrl=courseUrl, facultyName =self.normalize_string(faculty["value"]))
                    if course:
                        courses.append(course)

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None

    def getCourse(self, courseUrl: str, facultyName: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)

            title = self.cleanText(self.driver.find_element(By.XPATH, '//div[@class="bannercourse__bgyellow animated fadeInLeft title-slider"]//h1').text).capitalize()

            image = None
            try:
                image = self.driver.find_element(By.XPATH, '//figure//img[@class="banner-desk hidden-xs"]').get_attribute('src')
            except NoSuchElementException:
                pass

            if not image:
                try:
                    image = self.driver.find_element(By.XPATH, '//figure//img[@class="banner-mobi hidden-sm hidden-md hidden-lg"]').get_attribute('src')
                except NoSuchElementException:
                    pass

            description = None
            try:
                pElements = self.driver.find_elements(By.XPATH, '//div[@class="container_item bg__gray"]/p')
                description = self.cleanText(" ".join([p.text.strip() for p in pElements if p.text]))
                description = f"{description[:2000-3]}..." if len(description) > 2000 else description
                description = None if description.strip() == "" else description
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            prerequisites = None
            price = None

            try:
                priceElement = self.driver.find_element(By.XPATH, '//h4[contains(text(), "Inversión:")]//ancestor::div[1]/div[@class="order__rate"]/p[@class="info__rate" and (@data-rate="temprana" or @data-rate="plena")]')
                priceMatch = re.search(r'\s*\$\s*([\d,\.]+)', priceElement.text).group(1)
                price = float(priceMatch.replace('$', '').replace('.', '').replace(',', '.').strip())
            except Exception as e:
                pass

            if not price:
                try:
                    buttonShowPriceElement = self.driver.find_element(By.XPATH, '//a[@class="link--default popup--open" and contains(text(), "Ver opciones de inversión")]')
                    self.driver.execute_script("arguments[0].click();", buttonShowPriceElement)

                    priceElement = WebDriverWait(self.driver, 10).until(
                        EC.visibility_of_element_located(((By.XPATH, '//p[@class="popup__paragraph" and @data-coin="COP"]'))
                    ))

                    priceMatch = re.search(r'\s*\$\s*([\d,\.]+)', priceElement.text).group(1)
                    price = float(priceMatch.replace('$', '').replace('.', '').replace(',', '.').strip())
                except Exception as e:
                    self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            duration = None

            try:
                duration = self.cleanText(self.driver.find_element(By.XPATH, '//h4[contains(text(), "Duración:")]//ancestor::div[1]/h3').text)
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            modality = None

            try:
                modality = self.cleanText(self.driver.find_element(By.XPATH, '//h4[contains(text(), "Modalidad:")]//ancestor::div[1]/h3').text)    
            except Exception as e:
                self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")

            contents = []
            try:
                contentElements = self.driver.find_elements(By.XPATH, '//h2[contains(text(), "Contenido")]//ancestor::div[1]/p/strong')
                for contentElement in contentElements:
                    if self.cleanText(contentElement.text) != "":
                        content = self.cleanText(contentElement.text).replace(":", ".")
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
                category=facultyName,
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

