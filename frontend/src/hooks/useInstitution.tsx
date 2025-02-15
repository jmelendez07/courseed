import InstitutionInterface from "@/interfaces/institution";
import React from "react";
import APIS from "@/enums/apis";
import axios, { AxiosError, AxiosResponse } from "axios";

interface ResponseInstitutionProps {
	content: InstitutionInterface[];
	last: boolean;
}

function useInstitution() {
	const [institutions, setInstitutions] = React.useState<InstitutionInterface[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [selected, setSelected] = React.useState<InstitutionInterface | null>(null);
	const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
	const pageSize: number = 10;
	const [pageNumber, setPageNumber] = React.useState<number>(0);

	React.useEffect(() => {
		setLoading(true);
		axios.get(APIS.INSTITUTIONS, {
			params: {
				page: pageNumber,
				size: pageSize
			}
		})
			.then((response: AxiosResponse<ResponseInstitutionProps>) => {
				setInstitutions(currentInstitutions => pageNumber === 0 
					? response.data.content	
					: [
						{
							id: null,
							name: "Todas las Instituciones"
						},
						...currentInstitutions,
						...response.data.content
					]
				);
				setIsLastPage(response.data.last);
			})
			.catch((error: AxiosError) => console.error(error))
			.finally(() => setLoading(false));
	}, [pageNumber, pageSize]);

    return {
		institutions,
		loading,
		pageSize,
		pageNumber,
		selected,
		isLastPage,
		setInstitutions,
		setLoading,
		setPageNumber,
		setSelected,
		setIsLastPage
	}
}

export default useInstitution;