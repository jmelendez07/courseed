import useCourses from "@/hooks/useCourses";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Course from "@/components/ui/course";

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
                            <div className="p-1 h-full">
                                <Course
                                    course={course}
                                    optionsEnable={false}
                                    className="h-full"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default DashboardRecomendedCourses;