import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import LikeInterface from "@/interfaces/like";
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

    const handleDeleteLike = (id: string) => {
        if (!course) return;
        setCourse({
            ...course,
            likes: course.likes.filter(l => l.id !== id)
        });
    }

    const handleCreateLike = (like: LikeInterface) => {
        if (!course) return;
        setCourse({
            ...course,
            likes: [...course.likes, like]
        });
    }

    return {
        course,
        loading,
        setCourse,
        setLoading,
        handleCreateLike,
        handleDeleteLike
    };
}

export default useCourse;