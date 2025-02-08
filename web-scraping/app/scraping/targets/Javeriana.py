from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from app.persistence.documents.Content import Content
from typing import Optional
import requests
import re

class Javeriana(BaseScraper):
    INSTITUTION: str = "Pontificia Universidad Javeriana"
    PAGE_URL: str = "https://educacionvirtual.javeriana.edu.co"
    BODY: dict[str, str] = {
        "query": "",
        "visibilidad": "yes",
        "tipoPrograma": "",
        "areas": "",
        "facultad": "",
        "modalidad": "",
        "nivel": "",
        "tipoTutoria": "",
        "responsable": "EDUCON"
    }

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            response = requests.post(url=self.url, json=self.BODY)
            response.raise_for_status()
            data = response.json()

            for courseData in data:
                course = self.getCourse(courseData)    
                if course:
                    courses.append(course)

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")
            return None         

    def getCourse(self, courseData: dict[str, str]) -> CourseInteface:
        try:
            courseUrl = self.getAbsoluteUrl(url=courseData["urlPrograma"])
            self.logger.info(f"Loading the course URL: {courseUrl}")

            title = self.cleanText(f"{courseData["tipoPrograma"]} {courseData["nombre"]}")
            image = self.getAbsoluteUrl(url=courseData["urlImagenPrograma"])
            description = self.cleanText(courseData["descripcion"])
            prerequisites = None
            price = None

            for tag in courseData["tags"]:
                if tag.startswith("precio:"):
                    price = self.getPrice(tag.replace("precio:", ""))
                    break

            duration = self.cleanText(f"{courseData["duracion"]} {courseData["unidadDuracion"]}")
            modality = self.cleanText(courseData["modalidad"])
            category = self.cleanText(courseData["facultad"][-1].replace("Facultad de", "")).lower()

            contents: list[str] = []

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
            self.logger.error(f"Failed to get data for course URL: {self.getAbsoluteUrl(url=courseData["urlPrograma"])}. Exception: {str(e)}")
            return None
        finally:
            self.driver.back()

    def getAbsoluteUrl(self, url):
        relativeUrl = url if url[0] == "/" or self.PAGE_URL in url or url.startswith("http") else f"/{url}"
        return relativeUrl if self.PAGE_URL in relativeUrl or url.startswith("http") else self.PAGE_URL + relativeUrl
    
    def getPrice(self, priceText: str) -> Optional[float]:
        price = re.search(r'(\d+(\.\d{1,3})*)', priceText)
        if price:
            return float(price.group(1).replace('.', '').replace(',', '.'))
        return None
    
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

