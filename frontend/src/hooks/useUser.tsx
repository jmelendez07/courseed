import APIS from "@/enums/apis";
import UserInterface from "@/interfaces/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface ResponseUserProps {
	content: UserInterface[];
	last: boolean;
}

function useUser() {
    const pageSize: number = 10;
    const [users, setUsers] = React.useState<UserInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState<number>(0);

    React.useEffect(() => {
		setLoading(true);
		axios.get(APIS.USERS, {
			params: {
				page: pageNumber,
				size: pageSize
			}
		})
			.then((response: AxiosResponse<ResponseUserProps>) => {
				setUsers(currentUsers => pageNumber === 0 
					? response.data.content
					: [
						{
							id: null,
							email: "Todas los usuarios"
						},
						...currentUsers,
						...response.data.content
					]
				);
				setIsLastPage(response.data.last);
			})
			.catch((error: AxiosError) => console.error(error))
			.finally(() => setLoading(false));
	}, [pageNumber, pageSize]);

    return {
		users,
		loading,
		pageSize,
		pageNumber,
		isLastPage,
		setUsers,
		setLoading,
		setPageNumber,
		setIsLastPage
	}
}

export default useUser;