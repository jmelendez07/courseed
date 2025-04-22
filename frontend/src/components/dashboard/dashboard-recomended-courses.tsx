import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Course from "@/components/ui/course";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import { useAuth } from "@/providers/AuthProvider";
import { ColorContext } from "@/providers/ColorProvider";
import CourseSkeleton from "../skeleton/course-skeleton";

interface DashboardRecomendedCoursesResponseProps {
    content: CourseInterface[];
}

function DashboardRecomendedCourses() {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const authHook = useAuth();
    const colorContext = React.useContext(ColorContext);

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.USER_COURSES_RECOMENDED)
            .then((response: AxiosResponse<DashboardRecomendedCoursesResponseProps>) => {
                setCourses(response.data.content);
                console.log(response);
            })
            .catch((error) => {
                console.error("Error fetching recommended courses 2:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="grid grid-cols-1 overflow-hidden gap-4">
            <h2 className="text-xl font-semibold">
                Programas recomendados para ti, basados en tu interés por {" "}
                <span className={`text-${colorContext?.color}-600`}>{ authHook?.user?.profile.interest }</span>
                {" "}y aprendizaje {" "}
                <span className={`text-${colorContext?.color}-600`}>{ authHook?.user?.profile.platformPrefered }</span>.
            </h2>
            <Carousel
                opts={{
                    align: "start"
                }}
            >
                <CarouselContent>
                    {loading ? (
                        Array(10).fill(0).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                                <div className="p-1 h-full">
                                    <CourseSkeleton 
                                        optionsEnable={false}
                                    />
                                </div>
                            </CarouselItem> 
                        ))
                    ) : (
                        courses.map(course => (
                            <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
                                <div className="p-1 h-full">
                                    <Course
                                        course={course}
                                        optionsEnable={false}
                                        className="h-full"
                                    />
                                </div>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default DashboardRecomendedCourses;