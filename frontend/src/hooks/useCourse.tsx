import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

interface useCourseProps {
    id: string | undefined
}

function useCourse({ id }: useCourseProps) {
    const [course, setCourse] = React.useState<CourseInterface | null | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true)
        axios.get(`${APIS.COURSES}/${id}`)
            .then((response: AxiosResponse) => {
                setCourse(response.data);
            })
            .catch((error: AxiosError) => {
                console.error(error);
                setCourse(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    return {
        course,
        loading,
        setCourse,
        setLoading
    };
}

export default useCourse;