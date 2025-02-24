import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";

interface UseReviewsAuthProps {
    size?: number;
}

interface ParamsProps {
    pageNumber: number;
    searchText: string;
    searchSubmit: boolean;
}

interface ResponseProps {
    content: ReviewCourseUserInterface[];
    last: boolean;
	empty: boolean;
    totalElements: number;
}

function useReviewsAuth({ size }: UseReviewsAuthProps) {
    const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [totalReviews, setTotalReviews] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        searchSubmit: false,
    });

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.REVIEWS_BY_AUTH_USER, {
            params: {
                size: pageSize,
                page: params.pageNumber,
                // search: params.searchText
            }
        })
            .then((response: AxiosResponse<ResponseProps>) => {
                setReviews(response.data.content);
                setIsLastPage(response.data.last || response.data.empty);
                setTotalReviews(response.data.totalElements);
            })
            .catch(() => setIsLastPage(true))
            .finally(() => setLoading(false));
    }, [pageSize, params.pageNumber, params.searchSubmit]);

    return {
        reviews,
        loading,
        isLastPage,
        totalReviews,
        params,
        setParams
    };
}

export default useReviewsAuth;