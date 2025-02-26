import useCourses from "@/hooks/useCourses";
import { Gallery } from "./ui/gallery";

function CoursesGallery() {
    const courseHook = useCourses({ size: 8 });

    return (
        <Gallery 
            heading="Cursos 🎓"
            linkText="Descubre todos los cursos que ofrecemos."
            url="/educacion"
            items={courseHook.courses}
        />
    )
}

export default CoursesGallery;