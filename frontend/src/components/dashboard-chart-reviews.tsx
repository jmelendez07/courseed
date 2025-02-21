import React from "react";
import BarChartHorizontal from "./bar-chart-horizontal";
import LineChart from "./line-chart";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import CoursesWithRatingAvg from "@/interfaces/courses-with-rating-avg";
import dayjs from "dayjs";
import MonthsWithReviewsCount from "@/interfaces/months-with-reviews-count";

function DashboardChartReviews() {
    const [coursesWithRatingAvg, setCoursesWithRatingAvg] = React.useState<CoursesWithRatingAvg[]>([]);
    const [monthsWithReviewsCount, setMonthsWithReviewsCount] = React.useState<MonthsWithReviewsCount[]>([]);

    React.useEffect(() => {
        axios.get(APIS.COURSES_WITH_RATING_AVG, { params: { size: 5 } })
            .then((response: AxiosResponse<CoursesWithRatingAvg[]>) => {
                setCoursesWithRatingAvg(response.data);
            })
            .catch(() => setCoursesWithRatingAvg([]));
    }, []);

    React.useEffect(() => {
        axios.get(APIS.REVIEWS_COUNT_BY_MONTH)
            .then((response: AxiosResponse<MonthsWithReviewsCount[]>) => {
                setMonthsWithReviewsCount(response.data);
            })
            .catch(() => setMonthsWithReviewsCount([]))
    }, []);

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <LineChart 
                title="📅 Reseñas Recibidas Mensualmente (Último Semestre)"
                description={dayjs().format("MMM - MMMM YYYY")}
                className="md:col-span-2"
                labelValueToolTip="Reseñas"
                chartData={monthsWithReviewsCount.map(m => ({ month: m.month + " - " + m.year, count: m.count }))}
            />
            <BarChartHorizontal 
                title={`Top ${coursesWithRatingAvg.length} Cursos con Mejores Reseñas`}
                description="Estos son los cursos más valorados por su calidad, contenido y enseñanza."
                labelValueToolTip="Calificación"
                chartData={coursesWithRatingAvg.sort((a, b) => (a.avgRating > b.avgRating ? -1 : 1)).map(c => ({ label: c.title, value: c.avgRating }))}
            />
        </div>
    );
}

export default DashboardChartReviews;