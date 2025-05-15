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
import requests
from app.lib.utils import standarize_modality, standarize_duration, standarize_category, uploadFile, clean_html

class UniAndes(BaseScraper):
    INSTITUTION: str = "universidad de los andes"
    INSTITUTION_IMAGE_URL: str = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/University_of_Los_Andes_logo.svg/1726px-University_of_Los_Andes_logo.svg.png"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []
        from_idx = 0
        step = 50

        try:
            while True:
                to_idx = from_idx + step - 1
                url = f"{self.url}?_from={from_idx}&_to={to_idx}"
                self.logger.info(f"Loading the URL: {url}")
                response = requests.get(url)
                data = response.json()
                
                if not data:
                    break

                for courseData in data:
                    course = self.getCourse(courseData)
                    if course:
                        courses.append(course)
                    
                from_idx += step

            return courses

        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None
            

    def getCourse(self, courseData: dict[str, str]) -> CourseInteface:
        try:
            courseUrl = courseData["link"]
            title = courseData["productName"]
            image = courseData["items"][0]["images"][0]["imageUrl"]
            description = clean_html(courseData["description"])
            price = courseData["items"][0]["sellers"][0]["commertialOffer"]["Price"]
            duration = courseData["Duración Horas"][0]
            modality = courseData["Modalidad"][0]
            category = courseData["brand"]
            type = courseData["Tipo de Curso"][0]
            
            if "diplomado" in type.lower():
                type = "diplomado"
            elif "seminario" in type.lower(): 
                type = "seminario"
            elif "taller" in type.lower():
                type = "taller"
            else: 
                type = "curso"

            contents = []

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

    def saveToDatabase(self, courses: list[CourseInteface]):
        institutionImageUrl: str = uploadFile(self.INSTITUTION_IMAGE_URL, "institutions")
        institutionDocument = Institution.objects(name=self.INSTITUTION).modify(upsert=True, set__name=self.INSTITUTION, set__image=institutionImageUrl, new=True)
        
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

