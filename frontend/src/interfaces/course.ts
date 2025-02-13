import CategoryInterface from "./category";
import ContentInterface from "./content";
import InstitutionInterface from "./institution";
import LikeInterface from "./like";
import ReviewInterface from "./review";

interface CourseInterface {
    id: string;
    url: string;
    title: string;
    image: string;
    description: string;
    prerequisites: string;
    price: number;
    duration: string;
    modality: string;
    category: CategoryInterface;
    institution: InstitutionInterface;
    contents: ContentInterface[];
    likes: LikeInterface[];
    reviews: ReviewInterface[];
}

export default CourseInterface;