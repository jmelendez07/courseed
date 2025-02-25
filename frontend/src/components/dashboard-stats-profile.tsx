import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import React from "react";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import LikeWithCourseUser from "@/interfaces/like-with-course-user";
import { Button } from "./ui/button";

interface ResponseReviewProps {
    content: ReviewCourseUserInterface[];
}

function DashboardStatsProfile() {
    const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([]);
    const [likes, setLikes] = React.useState<LikeWithCourseUser[]>([]);

    React.useEffect(() => {
        axios.get(APIS.REVIEWS_BY_AUTH_USER, {
            params: {
                page: 0,
                size: 4
            }
        })
            .then((response: AxiosResponse<ResponseReviewProps>) => {
                setReviews(response.data.content);
            })
            .catch(() => setReviews([]));
    }, []);

    React.useEffect(() => {
        axios.get(APIS.LIKES_BY_AUTH_USER, {
            params: {
                page: 0,
                size: 4
            }
        })
            .then((response: AxiosResponse<{ content: LikeWithCourseUser[] }>) => {
                setLikes(response.data.content);
            })
            .catch(() => setLikes([]));
    }, []);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        Últimos Cursos Reseñados
                        <CalendarDays className="ml-2 h-4 w-4 min-w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        {reviews.length > 0 ? reviews.map((review) => (
                            <li key={review.id} className="flex justify-between items-center gap-2 group">
                                <div className="flex items-center gap-2 flex-1">
                                    <img
                                        src={review.course.image}
                                        alt={review.course.title}
                                        title={review.course.title}
                                        className="size-14 min-w-14 rounded-md object-cover"
                                    />
                                    <p className="font-medium text-sm line-clamp-3">
                                        {review.course.title}. <span className="text-xs text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <Button asChild size="sm">
                                    <a
                                        href={`/educacion/${review.course.id}`}
                                        target="_blank"
                                        className="px-[0.5rem] rounded transition-transform group-hover:translate-x-1"
                                    >
                                        <ArrowUpRight className="size-4" />
                                    </a>
                                </Button>
                            </li>
                        )) : (
                            <div className="w-full flex items-center justify-center h-64 overflow-hidden">
                                <p className="text-gray-600">No hay cursos reseñados</p>
                            </div>
                        )}
                    </ul>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        Últimos Cursos Likeados
                        <CalendarDays className="ml-2 h-4 w-4 min-w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        {likes.length > 0 ? likes.map((like) => (
                            <li key={like.id} className="flex justify-between items-center gap-2 group">
                                <div className="flex items-center gap-2 flex-1">
                                    <img
                                        src={like.course.image}
                                        alt={like.course.title}
                                        title={like.course.title}
                                        className="size-14 rounded-md object-cover"
                                    />
                                    <p className="font-medium text-sm line-clamp-3">
                                        {like.course.title}. <span className="text-xs text-gray-600">{new Date(like.createdAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <Button asChild size="sm">
                                    <a
                                        href={`/educacion/${like.course.id}`}
                                        target="_blank"
                                        className="px-[0.5rem] rounded transition-transform group-hover:translate-x-1"
                                    >
                                        <ArrowUpRight className="size-4" />
                                    </a>
                                </Button>
                            </li>
                        )) : (
                            <div className="w-full flex items-center justify-center h-64 overflow-hidden">
                                <p className="text-gray-600">No hay cursos con me gusta</p>
                            </div>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardStatsProfile;