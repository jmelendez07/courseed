import { GalleryCourseItems } from "./ui/gallery-course-items";
import useCourses from "@/hooks/useCourses";

function DiplomasGallery() {
    const courseHook = useCourses();

    return (
        <GalleryCourseItems
            heading="Diplomados" 
            url="/cursos"
            linkText="Descubre todos los diplomados que ofrecemos."
            items={courseHook.courses}
        />
    );
}

export default DiplomasGallery;