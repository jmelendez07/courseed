import CoursesGallery from "@/components/courses-gallery";
import DiplomasGallery from "@/components/diplomas-gallery";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/ui/hero";
import { Logos } from "@/components/ui/logos";
import { Navbar } from "@/components/ui/navbar";
import useInView from "@/hooks/useInView";
import HeadProvider from "@/providers/HeadProvider";
import React from "react";
import { useLocation } from "react-router-dom";

const WorkShopsGallery = React.lazy(() => import("@/components/workshops-gallery"));

function Landing() {
    const location = useLocation();
    React.useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "smooth" });
    }, [location.pathname]);

    const [coursesRef, showCourses] = useInView();
    const [diplomasRef, showDiplomas] = useInView();
    const [workshopsRef, showWorkshops] = useInView();
    const [logosRef, showLogos] = useInView();

    return (
        <>
            <HeadProvider title="Courseed" />
            <Navbar />
            <Hero />
            <CoursesGallery />
            <DiplomasGallery />
            <WorkShopsGallery />
            <Logos heading="Con la confianza de estas instituciones" />
            <Footer />
        </>
    );
}

export default Landing;