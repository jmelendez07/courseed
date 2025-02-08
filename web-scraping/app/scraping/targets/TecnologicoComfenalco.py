from app.scraping.BaseScraper import BaseScraper
from app.scraping.interfaces.CourseInterface import CourseInteface
from app.persistence.documents.Category import Category
from app.persistence.documents.Institution import Institution
from app.persistence.documents.Course import Course
from app.persistence.documents.Content import Content

class TecnologicoComfenalco(BaseScraper):
    url = "https://tecnologicocomfenalco.edu.co/educacion-continuada/"
    INSTITUTION: str = "Fundación Universitaria Tecnológico Comfenalco"

    def getCourses(self) -> list[CourseInteface]:
        courses: list[CourseInteface] = []

        try:
            self.logger.info(f"Loading the URL: {self.url}")
            self.driver.get(self.url)

            return courses
        except Exception as e:
            self.logger.error(f"Web scraping process encountered a failure. Exception: {str(e)}")

    def getCourse(self, courseUrl: str, categoryName: str) -> CourseInteface:
        try:
            self.logger.info(f"Loading the course URL: {courseUrl}")
            self.driver.get(courseUrl)
        except Exception as e:
            self.logger.error(f"Failed to get data for course URL: {courseUrl}. Exception: {str(e)}")
            return None
        finally:
            self.driver.back()

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

