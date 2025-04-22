import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Course from "@/components/ui/course";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";

interface DashboardRecomendedCoursesResponseProps {
    content: CourseInterface[];
}

function DashboardRecomendedCourses() {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);

    React.useEffect(() => {
        axios.get(APIS.USER_COURSES_RECOMENDED)
            .then((response: AxiosResponse<DashboardRecomendedCoursesResponseProps>) => {
                setCourses(response.data.content);
            })
            .catch((error) => {
                console.error("Error fetching recommended courses 2:", error);
            })
    }, []);

    return (
        <div className="grid grid-cols-1 overflow-hidden gap-4">
            <h2 className="text-xl font-semibold">Cursos recomendados para ti</h2>
            <Carousel
                opts={{
                    align: "start"
                }}
            >
                <CarouselContent>
                    {courses.map(course => (
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