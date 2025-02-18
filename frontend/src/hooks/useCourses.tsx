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
    searchSubmit: boolean;
    institution: InstitutionInterface | null;
    faculty: CategoryInterface | null;
}

function useCourses({ size }: { size?: number }) {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        searchSubmit: false,
        institution: null,
        faculty: null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);

        let url: string = APIS.COURSES;
        if (params.institution) {
            url = `${APIS.COURSES_BY_INSTITUTION}/${params.institution.id}`;
        } else if (params.faculty) {
            url = `${APIS.COURSES_BY_FACULTY}/${params.faculty.id}`;
        } else if (params.searchSubmit) {
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
    }, [params.pageNumber, pageSize, params.institution, params.searchText, params.searchSubmit, params.faculty]); 

    React.useEffect(() => handleFetch(), [params.pageNumber, pageSize, params.institution, params.faculty]);

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
        handleFetch
    };
}

export default useCourses;