import useCourses from "@/hooks/useCourses";
import { Gallery } from "./ui/gallery";
import React from "react";

function CoursesGallery() {
    const courseHook = useCourses({ size: 8, isVisibleParam: false });
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    courseHook.setIsVisible(true);
                    observer.disconnect();
                }
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [ref.current]);

    return (
        <Gallery
            ref={ref}
            heading="Cursos 🎓"
            linkText="Descubre todos los cursos que ofrecemos."
            url="/educacion"
            items={courseHook.courses}
            loading={courseHook.loading}
        />
    )
}

export default CoursesGallery;