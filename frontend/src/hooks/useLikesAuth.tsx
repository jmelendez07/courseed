import APIS from "@/enums/apis";
import LikeInterface from "@/interfaces/like";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface UseLikesAuthProps {
    size?: number;
}

interface ParamsProps {
    pageNumber: number;
    searchText: string;
    searchSubmit: boolean;
}

interface ResponseProps {
    content: LikeInterface[];
    last: boolean;
	empty: boolean;
    totalElements: number;
}

function useLikesAuth({ size }: UseLikesAuthProps) {
    const [likes, setLikes] = React.useState<LikeInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [totalLikes, setTotalLikes] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        searchSubmit: false,
    });

    React.useEffect(() => {
        if (params.searchSubmit) return;
        setLoading(true);
        axios.get(APIS.LIKES_BY_AUTH_USER, {
            params: {
                size: pageSize,
                page: params.pageNumber,
                search: params.searchText
            }
        })
            .then((response: AxiosResponse<ResponseProps>) => {
                setLikes(currentLikes => params.pageNumber > 0 
                    ? [ ...currentLikes, ...response.data.content ]
                    : response.data.content
                );
                setIsLastPage(response.data.last || response.data.empty);
                setTotalLikes(response.data.totalElements);
            })
            .catch(() => setIsLastPage(true))
            .finally(() => setLoading(false));
    }, [pageSize, params.pageNumber]);

    const handleSearch = React.useCallback(() => {
        setLoading(true);
        setParams({
            ...params,
            searchSubmit: true,
            pageNumber: 0, 
        });
        axios.get(APIS.LIKES_BY_AUTH_USER, {
            params: {
                size: pageSize,
                page: 0,
                search: params.searchText
            }
        })
            .then((response: AxiosResponse<ResponseProps>) => {
                setLikes(response.data.content);
                setIsLastPage(response.data.last || response.data.empty);
                setTotalLikes(response.data.totalElements);
            })
            .catch(() => setIsLastPage(true))
            .finally(() => setLoading(false));
    }, [params.searchText, params.searchSubmit]);

    return {
        likes,
        loading,
        isLastPage,
        totalLikes,
        pageSize,
        params,
        setParams,
        handleSearch
    };
}

export default useLikesAuth;