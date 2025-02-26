import useCourses from "@/hooks/useCourses";
import { Gallery } from "./ui/gallery";

function DiplomasGallery() {
    const courseHook = useCourses({ size: 8 });

    return (
        <Gallery 
            heading="Diplomados 📜"
            linkText="Descubre todos los diplomados que ofrecemos."
            url="/educacion"
            items={courseHook.courses}
        />
    )
}

export default DiplomasGallery;