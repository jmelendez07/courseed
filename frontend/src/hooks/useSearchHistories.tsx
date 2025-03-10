import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import SearchHistoryInterface from "@/interfaces/search-history";

interface ResponseProps {
    content: SearchHistoryInterface[];
    last: boolean;
	empty: boolean;
}

interface useSearchHistoriesProps {
    size?: number;
}

function useSearchHistories({ size }: useSearchHistoriesProps) {
    const [searchHistories, setSearchHistories] = React.useState<SearchHistoryInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const pageSize = size ?? 12;
    const [params, setParams] = React.useState({
        pageNumber: 0,
    });

    React.useEffect(() => {
        setLoading(true);

        axios.get(APIS.SEARCH_HISTORIES_BY_AUTH_USER, {
            params: {
                page: params.pageNumber,
                size: pageSize
            }
        })
            .then((response: AxiosResponse<ResponseProps>) => {
                setSearchHistories(current => params.pageNumber === 0 
                    ? response.data.content
                    : [...current, ...response.data.content]
                );
                setIsLastPage(response.data.empty || response.data.last);
            })
            .catch(() => setIsLastPage(true))
            .finally(() => setLoading(false))
    }, [pageSize, params.pageNumber]);

    return {
        searchHistories,
        setSearchHistories,
        loading,
        setLoading,
        isLastPage,
        setIsLastPage,
        params,
        setParams
    }
}

export default useSearchHistories;