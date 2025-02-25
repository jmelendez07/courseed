import { GalleryCourseItems } from "./ui/gallery-course-items";
import useCourses from "@/hooks/useCourses";

function WorkShopsGallery() {
    const courseHook = useCourses({});
    console.log(1)

    return (
        <GalleryCourseItems
            heading="Talleres" 
            url="/educacion"
            linkText="Descubre todos los talleres que ofrecemos."
            items={courseHook.courses}
        />
    );
}

export default WorkShopsGallery;