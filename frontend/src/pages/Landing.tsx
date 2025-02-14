import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/ui/hero";
import { Logos } from "@/components/ui/logos";
import { Navbar } from "@/components/ui/navbar";
import HeadProvider from "@/providers/HeadProvider";

function Landing() {
    return (
        <>
            <HeadProvider title="Courseed" />
            <Navbar />
            <Hero />
            <Logos />
            <Footer />
        </>
    );
}

export default Landing;