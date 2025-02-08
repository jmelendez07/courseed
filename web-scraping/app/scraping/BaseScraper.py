from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from app.scraping.interfaces.CourseInterface import CourseInteface
from urllib.robotparser import RobotFileParser
from urllib.parse import urlparse
from app.scraping.Logger import Logger

class BaseScraper:
    def __init__(self, url: str):
        self.url: str = url
        self.logger: Logger = Logger(url)
        self.driver: webdriver.Chrome = self.initDriver()

    def initDriver(self) -> webdriver.Chrome:
        self.logger.info("Starting the web scraping process...")

        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920x1080")

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)

        return driver

    def verifyRobots(self) -> bool:
        parseUrl = urlparse(url=self.url)
        baseUrl = f"{parseUrl.scheme}://{parseUrl.netloc}"
        robotUrl = f"{baseUrl}/robots.txt"
        pathUrl = parseUrl.path
        userAgent = self.driver.execute_script("return navigator.userAgent;")

        self.logger.info(f"Checking for restrictions in {robotUrl}")

        robotFileParser = RobotFileParser(url=robotUrl)
        robotFileParser.read()
        canFetch = robotFileParser.can_fetch(useragent=userAgent, url=pathUrl)

        if not canFetch:
            self.logger.error("Access to scrape this site is not allowed.")

        return canFetch

    def getCourses(self) -> list[CourseInteface]:
        raise NotImplementedError("You must implement this method in the child class.")

    def saveToDatabase(self, courses: list[CourseInteface]):
        raise NotImplementedError("You must implement this method in the child class.")

    def scrape(self):
        if self.verifyRobots():
            courses = self.getCourses()
            if courses is not None:
                self.saveToDatabase(courses)

        self.driver.quit()
        self.logger.close()