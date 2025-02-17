import CoursesGallery from "@/components/courses-gallery";
import DiplomasGallery from "@/components/diplomas-gallery";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/ui/hero";
import { Logos } from "@/components/ui/logos";
import { Navbar } from "@/components/ui/navbar";
import WorkShopsGallery from "@/components/workshops-gallery";
import HeadProvider from "@/providers/HeadProvider";

function Landing() {
    return (
        <>
            <HeadProvider title="Courseed" />
            <Navbar />
            <Hero />
            <CoursesGallery />
            <DiplomasGallery />
            <WorkShopsGallery />
            <Logos />
            <Footer />
        </>
    );
}

export default Landing;