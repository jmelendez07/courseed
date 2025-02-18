import { Badge } from "@/components/ui/badge";
import useCourses from "@/hooks/useCourses";
import Course from "./course";
import { Button } from "./button";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";

interface BlogCoursesProps {
    tagline: string;
    heading: string;
    description: string;
}

const BlogCourses = ({
    tagline,
    heading,
    description,
}: BlogCoursesProps) => {

    const courseHook = useCourses({});

    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto flex flex-col items-center gap-16 px-4 md:px-8 lg:px-16">
                <div className="text-center">
                    <Badge variant="secondary" className="mb-6">
                        {tagline}
                    </Badge>
                    <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
                        {heading}
                    </h2>
                    <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                        {description}
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {courseHook.courses.map((course) => (
                        <Course
                            key={course.id}
                            course={course}
                            optionsEnable={false}
                            className="md:max-w-[400px]"
                        />
                    ))}
                </div>
                <div className="flex items-center justify-center space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (courseHook.isLastPage) {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            } else {
                                courseHook.setParams({
                                    ...courseHook.params,
                                    pageNumber: courseHook.params.pageNumber + 1
                                });
                            }
                        }}
                        disabled={courseHook.loading}
                    >
                        {courseHook.isLastPage ? (
                            <>
                                ¡Lo has visto todo! Vuelve arriba.
                                <ChevronUp />
                            </>
                        ) : (
                            <>
                                Mostrar mas cursos
                                {courseHook.loading ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <ChevronDown />
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export { BlogCourses };