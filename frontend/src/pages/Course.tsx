import { BlogReviews } from "@/components/ui/blog-reviews";
import { Footer } from "@/components/ui/footer";
import { HeroCourse } from "@/components/ui/hero-course";
import { Navbar } from "@/components/ui/navbar";
import useCourse from "@/hooks/useCourse";
import HeadProvider from "@/providers/HeadProvider";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function Course() {
    const params = useParams();
    const courseHook = useCourse({ id: params.id });
    const navigate = useNavigate();

    const BlogReviewsRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        if (courseHook.course === null) {
            navigate("/404", { replace: true });
        }
    }, [courseHook.course]);

    return (
        <>
            <HeadProvider title={`Courseed ${courseHook.course && '| ' + courseHook.course.title}`} />
            <Navbar />
            <HeroCourse 
                url={courseHook.course?.url}
                heading={courseHook.course?.title} 
                description={courseHook.course?.description}  
                reviews={courseHook.course?.reviews}
                handlePrimaryButton={() => {
                    if (BlogReviewsRef.current) BlogReviewsRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                image={courseHook.course?.image}
                duration={courseHook.course?.duration}
                modality={courseHook.course?.modality}
                price={courseHook.course?.price}
            />
            <BlogReviews
                ref={BlogReviewsRef}
                reviews={courseHook.course?.reviews ? courseHook.course.reviews : []}
                tagline = "Opiniones compartidas"
                heading = "Reseñas"
                description = "Conoce las valoraciones de otros participantes y toma una decisión informada. Las reseñas te permiten conocer tanto los aspectos positivos como las áreas de mejora que los estudiantes han experimentado, lo que te ayudará a tener una visión completa del curso."
            />
            <Footer />
        </>
    );
}

export default Course;