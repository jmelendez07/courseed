import APIS from "@/enums/apis";
import CategoryInterface from "@/interfaces/category";
import CourseInterface from "@/interfaces/course";
import InstitutionInterface from "@/interfaces/institution";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface ResponseCourseProps {
    content: CourseInterface[];
    last: boolean;
    empty: boolean;
    totalElements: number;
}

interface ParamsProps {
    pageNumber: number;
    search: string;
    institution: InstitutionInterface | null;
    faculty: CategoryInterface | null;
}

interface UseCoursesProps {
    size?: number;
    institutionParam?: InstitutionInterface;
    facultyParam?: CategoryInterface;
    searchParam?: string
}

function useCourses({ size, institutionParam, facultyParam, searchParam }: UseCoursesProps) {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        search: searchParam || "",
        institution: institutionParam?.id ? institutionParam : null,
        faculty: facultyParam?.id ? facultyParam : null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);

        axios.get(APIS.COURSES, {
            params: {
                page: params.pageNumber,
                size: pageSize,
                search: params.search,
                institutionId: params.institution?.id,
                categoryId: params.faculty?.id,
            },
        })
            .then((response: AxiosResponse<ResponseCourseProps>) => {
                setCourses(currentCourses => params.pageNumber === 0
                    ? response.data.content
                    : [
                        ...currentCourses,
                        ...response.data.content
                    ]
                );
                setIsLastPage(response.data.last || response.data.empty);
                setTotalCourses(response.data.totalElements);
            })
            .catch(() => {
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }, [params.pageNumber, pageSize, params.institution, params.search, params.faculty]);

    const handleCreatedCourse = (course: CourseInterface) => {
        setCourses(currentCourses => [
            course,
            ...currentCourses
        ]);
    }

    const handleUpdateCourse = (course: CourseInterface) => {
        setCourses([
            ...courses.map(c => {
                if (c.id === course.id) {
                    return course;
                } else {
                    return c;
                }
            })
        ]);
    }

    const handleDeleteCourse = (course: CourseInterface) => {
        setCourses(courses.filter(c => c.id !== course.id));
    }

    React.useEffect(() => handleFetch(), [params.pageNumber, params.search, pageSize, params.institution?.id, params.faculty?.id]);

    return {
        courses,
        loading,
        pageSize,
        isLastPage,
        totalCourses,
        params,
        setCourses,
        setLoading,
        setIsLastPage,
        setTotalCourses,
        setParams,
        handleCreatedCourse,
        handleUpdateCourse,
        handleDeleteCourse
    };
}

export default useCourses;