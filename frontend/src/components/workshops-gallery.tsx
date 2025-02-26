import useCourses from "@/hooks/useCourses";
import { Gallery } from "./ui/gallery";

function WorkShopsGallery() {
    const courseHook = useCourses({ size: 8 });
    
    return (
        <Gallery 
            heading="Talleres 📚"
            url="/educacion"
            linkText="Descubre todos los talleres que ofrecemos."
            items={courseHook.courses}
        />
    )
}

export default WorkShopsGallery;