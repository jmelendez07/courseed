import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { Eye, GraduationCap, Star, ThumbsUp, Users } from "lucide-react";

interface TotalProps {
    lastMonth: number;
    total: number;
}

function DashboardStats() {
    const [totalUsers, setTotalUsers] = React.useState<TotalProps | null>(null);
    const [totalReviews, setTotalReviews] = React.useState<TotalProps | null>(null);
    const [totalLikes, setTotalLikes] = React.useState<TotalProps | null>(null);
    const [totalViews, setTotalViews] = React.useState<TotalProps | null>(null);

    React.useEffect(() => {
        axios.get(APIS.USERS_TOTAL)
            .then((response: AxiosResponse<TotalProps>) => setTotalUsers(response.data))
            .catch(() => setTotalUsers(null));
    }, []);

    React.useEffect(() => {
        axios.get(APIS.REVIEWS_TOTAL)
            .then((response: AxiosResponse<TotalProps>) => setTotalReviews(response.data))
            .catch(() => setTotalReviews(null));
    }, []);

    React.useEffect(() => {
        axios.get(APIS.LIKES_TOTAL)
            .then((response: AxiosResponse<TotalProps>) => setTotalLikes(response.data))
            .catch(() => setTotalLikes(null));
    }, []);

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                <p className="text-muted-foreground">Gestiona cursos, usuarios y reseñas</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                        <Users className={`h-4 w-4 text-blue-500`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers?.total ? totalUsers.total : 0}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={`${(totalUsers?.lastMonth && totalUsers.lastMonth > 0) ? "text-green-500" : "text-red-500"}`}>
                                {totalUsers?.lastMonth ? "+ " + totalUsers.lastMonth : 0}
                            </span>{" "}
                            Creados este nuevo mes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
                        <Star className={`h-4 w-4 text-yellow-500`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReviews?.total ? totalReviews.total : 0}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={`${(totalReviews?.lastMonth && totalReviews.lastMonth > 0) ? "text-green-500" : "text-red-500"}`}>
                                {totalReviews?.lastMonth ? "+ " + totalReviews.lastMonth : 0}
                            </span>{" "}
                            Creados este nuevo mes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Reacciones</CardTitle>
                        <ThumbsUp className={`h-4 w-4 text-purple-500`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLikes?.total ? totalLikes.total : 0}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={`${(totalLikes?.lastMonth && totalLikes.lastMonth > 0) ? "text-green-500" : "text-red-500"}`}>
                                {totalLikes?.lastMonth ? "+ " + totalLikes.lastMonth : 0}
                            </span>{" "}
                            Creados este nuevo mes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Visitas</CardTitle>
                        <Eye className={`h-4 w-4 text-green-500`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLikes?.total ? totalLikes.total : 0}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={`${(totalLikes?.lastMonth && totalLikes.lastMonth > 0) ? "text-green-500" : "text-red-500"}`}>
                                {totalLikes?.lastMonth ? "+ " + totalLikes.lastMonth : 0}
                            </span>{" "}
                            Creados este nuevo mes
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default DashboardStats;