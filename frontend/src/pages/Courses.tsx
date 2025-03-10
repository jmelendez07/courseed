import { BlogCourses } from "@/components/ui/blog-courses";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";
import HeadProvider from "@/providers/HeadProvider";
import React from "react";
import { useLocation } from "react-router-dom";

function Courses() {
    const location = useLocation();
    React.useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "smooth" });
    }, [location.pathname]);
    
    return (
        <>
            <HeadProvider title="Courseed | Educación Continuada" />
            <Navbar />
            <BlogCourses
                heading="Educación Continuada"
                description="Explora nuestra amplia gama de cursos y diplomados para seguir aprendiendo y creciendo profesionalmente."
            />
            <Footer />
        </>
    );
}

export default Courses;