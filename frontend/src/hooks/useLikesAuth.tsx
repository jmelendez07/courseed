import React from "react";

interface UseLikesAuthProps {
    size?: number;
}

interface ParamsProps {
    pageNumber: number;
    searchText: string;
    searchSubmit: boolean;
}

function useLikesAuth({ size }: UseLikesAuthProps) {
    const [likes, setLikes] = React.useState([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [totalLikes, setTotalLikes] = React.useState<number | null>(null);
    const pageSize: number = size ?? 12;

    const [params, setParams] = React.useState<ParamsProps>({
        pageNumber: 0,
        searchText: "",
        searchSubmit: false,
    });

    React.useEffect(() => {
        setLoading(true);
    }, []);

    return {
        likes,
        loading,
        isLastPage,
        totalLikes,
        pageSize,
        params,
        setParams
    };
}

export default useLikesAuth;