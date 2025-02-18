import APIS from "@/enums/apis";
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
        institution: null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);

		axios.get(params.institution
            ? `${APIS.COURSES_BY_INSTITUTION}/${params.institution.id}` 
            : params.searchSubmit
                ? `${APIS.COURSES_SEARCH}?text=${params.searchText}` 
                : APIS.COURSES, {
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
    }, [params.pageNumber, pageSize, params.institution, params.searchText, params.searchSubmit]); 

    React.useEffect(() => handleFetch(), [params.pageNumber, pageSize, params.institution]);

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