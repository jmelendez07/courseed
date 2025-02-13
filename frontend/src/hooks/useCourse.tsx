import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import InstitutionInterface from "@/interfaces/institution";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface ResponseCourseProps {
	content: CourseInterface[];
	last: boolean;
    totalElements: number;
}

function useCourse() {
    const [courses, setCourses] = React.useState<CourseInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = 12;
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [searchText, setSearchText] = React.useState<string>("");
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [institution, setInstitution] = React.useState<InstitutionInterface | null>(null);

    React.useEffect(() => {
        console.log(institution);
        
		setLoading(true);
		axios.get(institution 
            ? `${APIS.COURSES_BY_INSTITUTION}/${institution.id}` 
            : APIS.COURSES, {
			params: {
				page: pageNumber,
				size: pageSize
			},
		})
			.then((response: AxiosResponse<ResponseCourseProps>) => {
				setCourses(currentCourses => pageNumber === 0 
                    ? response.data.content 
                    : [
					    ...currentCourses,
					    ...response.data.content
                    ]
                );
				setIsLastPage(response.data.last);
                setTotalCourses(response.data.totalElements);
			})
			.catch((error: AxiosError) => console.error(error))
			.finally(() => setLoading(false));
	}, [pageNumber, pageSize, institution]);

    React.useEffect(() => {

    })

    return {
        courses,
        loading,
        pageSize,
        pageNumber,
        searchText,
        isLastPage,
        totalCourses,
        institution,
        setCourses,
        setLoading,
        setPageNumber,
        setSearchText,
        setIsLastPage,
        setTotalCourses,
        setInstitution
    };
}

export default useCourse;