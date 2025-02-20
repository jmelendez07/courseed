import APIS from "@/enums/apis";
import CategoryInterface from "@/interfaces/category";
import CourseInterface from "@/interfaces/course";
import InstitutionInterface from "@/interfaces/institution";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface ResponseCourseProps {
    content: CourseInterface[];
    last: boolean;
    empty: boolean;
    totalElements: number;
}

interface ParamsProps {
    pageNumber: number;
    searchText: string;
    institution: InstitutionInterface | null;
    faculty: CategoryInterface | null;
}

interface UseCoursesProps {
    size?: number;
    institutionParam?: InstitutionInterface;
    facultyParam?: CategoryInterface;
}

function useCourses({ size, institutionParam, facultyParam }: UseCoursesProps) {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        institution: institutionParam?.id ? institutionParam : null,
        faculty: facultyParam?.id ? facultyParam : null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);

        let url: string = APIS.COURSES;
        if (params.institution) {
            url = `${APIS.COURSES_BY_INSTITUTION}/${params.institution.id}`;
        } else if (params.faculty) {
            url = `${APIS.COURSES_BY_FACULTY}/${params.faculty.id}`;
        } else if (params.searchText) {
            url = `${APIS.COURSES_SEARCH}?text=${params.searchText}`;
        }

        axios.get(url, {
            params: {
                page: params.pageNumber,
                size: pageSize
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
            .catch((error: AxiosError) => {
                console.error(error);
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }, [params.pageNumber, pageSize, params.institution, params.searchText, params.faculty]);

    const handleSearch = () => {
        setParams({
            ...params,
            institution: null,
            faculty: null,
            pageNumber: 0
        });
        setLoading(true);
        axios.get(`${APIS.COURSES_SEARCH}?text=${params.searchText}`, {
            params: {
                page: 0,
                size: pageSize
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
            .catch((error: AxiosError) => {
                console.error(error);
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }

    const handleCreatedCourse = (course: CourseInterface) => {
        alert(1);
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

    React.useEffect(() => handleFetch(), [params.pageNumber, pageSize, params.institution?.id, params.faculty?.id]);

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
        handleSearch,
        handleCreatedCourse,
        handleUpdateCourse,
        handleDeleteCourse
    };
}

export default useCourses;