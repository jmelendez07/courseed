import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/ui/hero";
import { Navbar } from "@/components/ui/navbar";
import useInView from "@/hooks/useInView";
import HeadProvider from "@/providers/HeadProvider";
import React from "react";
import { useLocation } from "react-router-dom";

const CoursesGallery = React.lazy(() => import("@/components/courses-gallery"));
const WorkShopsGallery = React.lazy(() => import("@/components/workshops-gallery"));
const DiplomasGallery = React.lazy(() => import("@/components/diplomas-gallery"));
const Logos = React.lazy(() => import("@/components/ui/logos"));

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
            <div ref={coursesRef}>
                {showCourses && (
                <React.Suspense fallback={<p>Cargando Cursos...</p>}>
                    <CoursesGallery />
                </React.Suspense>
                )}
            </div>
            <div ref={diplomasRef}>
                {showDiplomas && (
                <React.Suspense fallback={<p>Cargando Diplomados...</p>}>
                    <DiplomasGallery />
                </React.Suspense>
                )}
            </div>
            <div ref={workshopsRef}>
                {showWorkshops && (
                <React.Suspense fallback={<p>Cargando Talleres...</p>}>
                    <WorkShopsGallery />
                </React.Suspense>
                )}
            </div>
            <div ref={logosRef}>
                {showLogos && (
                <React.Suspense fallback={<p>Cargando Logos...</p>}>
                    <Logos heading="Con la confianza de estas instituciones" />
                </React.Suspense>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Landing;