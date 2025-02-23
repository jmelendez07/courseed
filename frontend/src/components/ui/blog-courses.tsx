import { Badge } from "@/components/ui/badge";
import useCourses from "@/hooks/useCourses";
import Course from "./course";
import { Button } from "./button";
import { ChevronDown, ChevronUp, LoaderCircle, Search } from "lucide-react";
import { Input } from "./input";
import useInstitution from "@/hooks/useInstitution";
import useFaculty from "@/hooks/useFaculty";
import ComboBoxResponsive from "./combo-box-responsive";
import { useSearchParams } from "react-router-dom";
import React from "react";

interface BlogCoursesProps {
    heading: string;
    description: string;
}

const BlogCourses = ({
    heading,
    description,
}: BlogCoursesProps) => {

    const [searchParams] = useSearchParams();
    const courseHook = useCourses({ 
        institutionParam: {id: searchParams.get('institucion'), name: undefined},
        facultyParam: {id: searchParams.get('facultad'), name: undefined}
    });
    const institutionHook = useInstitution({ size: 7 });
    const facultyHook = useFaculty({ size: 7 });

    React.useEffect(() => {
        const institutionParamId = searchParams.get('institucion');
        const facultyParamId = searchParams.get('facultad');

        courseHook.setParams({
            ...courseHook.params,
            institution: institutionParamId ? {id: institutionParamId, name: undefined} : null,
            faculty: facultyParamId ? {id: facultyParamId, name: undefined} : null,
            pageNumber: 0,
        });
    }, [searchParams.get('institucion'), searchParams.get('facultad')]);

    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto flex flex-col items-center gap-16 px-4 md:px-8 lg:px-16">
                <div className="flex flex-col items-center">
                    <Badge variant="secondary" className="mb-6">
                        {courseHook.totalCourses} Cursos, Diplomados y Talleres
                    </Badge>
                    <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl text-center">
                        {heading}
                    </h2>
                    <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-center">
                        {description}
                    </p>
                    <div className="w-full max-w-full sm:max-w-4xl">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                            <form onSubmit={e => {
								e.preventDefault();
                                courseHook.handleSearch();
							}} className="relative w-full lg:w-[28rem] lg:max-w-md">
                                <Input
                                    type="text"
                                    placeholder="Buscar por titulo, descripción, duración..."
                                    value={courseHook.params.searchText}
                                    onChange={e => {
										courseHook.setParams({
											...courseHook.params,
											searchText: e.target.value
										});
									}}
                                    className="pr-10 w-full"
                                />
                                <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                                    <Search className="h-4 w-4" />
                                    <span className="sr-only">Buscar</span>
                                </Button>
                            </form>
                            <ComboBoxResponsive 
                                placeholder="Filtrar por Institución..."
								labelAll="Todas las instituciones"
								statuses={institutionHook.institutions}
								selectedStatus={courseHook.params.institution}
								setSelectedStatus={i => {
									courseHook.setParams({
										...courseHook.params,
										institution: i,
										pageNumber: 0,
                                        faculty: null
									});
								}}
								pagination={!institutionHook.isLastPage}
								onPaginate={() => institutionHook.setPageNumber(institutionHook.pageNumber + 1)}
                            />
                            <ComboBoxResponsive 
                                placeholder="Filtrar por Facultad..."
								labelAll="Todas las facultades"
								statuses={facultyHook.faculties}
								selectedStatus={courseHook.params.faculty}
								setSelectedStatus={f => {
									courseHook.setParams({
										...courseHook.params,
										faculty: f,
                                        institution: null,
										pageNumber: 0,
									});
								}}
								pagination={!facultyHook.isLastPage}
								onPaginate={() => facultyHook.setPageNumber(facultyHook.pageNumber + 1)}
                            />
                        </div>
                    </div>
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
                                Mostrar mas educación continuada
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