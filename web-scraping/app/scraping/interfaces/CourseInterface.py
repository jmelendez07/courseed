from dataclasses import dataclass
from typing import Optional

@dataclass
class CourseInteface:
    url: str
    title: str
    image: Optional[str]
    description: Optional[str]
    prerequisites: Optional[str]
    price: Optional[float]
    duration: Optional[str]
    modality: Optional[str]
    type: str
    institution: str
    category: Optional[str]
    contents: list[str]
