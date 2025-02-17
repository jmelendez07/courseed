import { GalleryCourseItems } from "./ui/gallery-course-items";
import useCourses from "@/hooks/useCourses";

function CoursesGallery() {
    const courseHook = useCourses();

    return (
        <GalleryCourseItems
            heading="Cursos" 
            url="/cursos"
            linkText="Descubre todos los cursos que ofrecemos."
            items={courseHook.courses}
        />
    );
}

export default CoursesGallery;