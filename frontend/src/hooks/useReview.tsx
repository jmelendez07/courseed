import APIS from "@/enums/apis";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import UserInterface from "@/interfaces/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface ResponseReviewProps {
	content: ReviewCourseUserInterface[];
	last: boolean;
	empty: boolean;
    totalElements: number;
}

interface ParamsProps {
    pageNumber: number;
    searchText: string;
    searchSubmit: boolean;
    user: UserInterface | null
}

function useReview() {
    const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [totalCourses, setTotalCourses] = React.useState<number | null>(null);
    const pageSize: number = 12;
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        searchSubmit: false,
        user: null
    });

    const handleFetch = React.useCallback(() => {
        setLoading(true);
		axios.get(APIS.REVIEWS, {
            params: {
                page: params.pageNumber,
                size: pageSize,
                search: params.searchText,
                user: params.user?.id
            }
        })
			.then((response: AxiosResponse<ResponseReviewProps>) => {
				setReviews(currentReviews => params.pageNumber === 0 
                    ? response.data.content 
                    : [
					    ...currentReviews,
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
    }, [params.pageNumber, pageSize, params.searchText, params.searchSubmit]); 

    React.useEffect(() => handleFetch(), [params.pageNumber, pageSize]);

    return {
        reviews,
        loading,
        pageSize,
        isLastPage,
        totalCourses,
        params,
        setReviews,
        setLoading,
        setIsLastPage,
        setTotalCourses,
        setParams,
        handleFetch
    };
}

export default useReview;