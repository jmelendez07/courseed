import useCourses from "@/hooks/useCourses";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Course from "./ui/course";
import FadeItem from "./ui/fadeItem";

function DashboardRecomendedCourses() {

    const coursesHook = useCourses({ size: 10 });

    return (
        <div className="grid grid-cols-1 overflow-hidden gap-4">
            <h2 className="text-xl font-semibold">Cursos recomendados para ti</h2>
            <Carousel
                opts={{
                    align: "start"
                }}
            >
                <CarouselContent>
                    {coursesHook.courses.map(course => (
                        <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                            <FadeItem className="h-full">
                                <div className="p-1 h-full">
                                    <Course
                                        course={course}
                                        optionsEnable={false}
                                        className="h-full"
                                    />
                                </div>
                            </FadeItem>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default DashboardRecomendedCourses;