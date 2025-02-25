import React from "react";
import BarChart from "./bar-chart";
import PieChart from "./pie-chart";
import InstitutionsWithCoursesCount from "@/interfaces/institutions-with-courses-count";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import CoursesWithReviewsLikesCount from "@/interfaces/courses-with-reviews-likes-count";
import { ColorContext } from "@/providers/ColorProvider";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";

const tailwindShades: number[] = [700, 600, 500, 400, 300, 200, 100];

function DashboardChartCourses() {
	const institutionsSize = 3;
	const coursesSize = 9;
	const [institutions, setInstitutions] = React.useState<InstitutionsWithCoursesCount[]>([]);
	const [courses, setCourses] = React.useState<CoursesWithReviewsLikesCount[]>([]);

	React.useEffect(() => {
		axios.get(APIS.INSTITUTIONS_COURSES_COUNT, {
			params: { page: 0, size: institutionsSize }
		})
			.then((response: AxiosResponse<InstitutionsWithCoursesCount[]>) => {
				setInstitutions(response.data);
			})
			.catch(() => {
				setInstitutions([]);
			})
	}, []);

	React.useEffect(() => {
		axios.get(APIS.COURSES_REVIEWS_LIKES_COUNT, {
			params: { page: 0, size: coursesSize }
		})
			.then((response: AxiosResponse<CoursesWithReviewsLikesCount[]>) => {
				setCourses(response.data);
			})
			.catch(() => setCourses([]));
	}, []);

	const colorHook = React.useContext(ColorContext);
    const fullConfig = resolveConfig(tailwindConfig);
    function getTailwindColor(color: string, shade: number = 600): string {
        const colors = fullConfig.theme?.colors as Record<string, any>;
        if (colors[color]) {
          return typeof colors[color] === "string" ? colors[color] : colors[color]?.[shade] || null;
        }
        return "oklch(0.588 0.158 241.966)";
    }

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<BarChart 
				className="md:col-span-2" 
				title={`Top ${coursesSize} Educaciones continuas con Mayor Interacción 📚`}
				description="Esta gráfica muestra el ranking de cursos según el número de likes y reseñas recibidos."
				chartData={courses.map((course) => ({
					label: course.title,
					bar1: course.totalReviews,
					bar2: course.totalLikes
				}))}
				labelBar1="Reseñas"
				labelBar2="Likes"
			/>
			<PieChart
				title={`Top ${institutionsSize} Instituciones con Mayor Oferta Académica 🎓`}
				description="Esta gráfica muestra las 5 instituciones con el mayor número de cursos disponibles."
				chartData={institutions.map((institution, index) => ({
					label: institution.name,
					value: institution.totalCourses,
					fill: getTailwindColor(colorHook ? colorHook.color : "sky", tailwindShades[index] || 100),
				}))}
			/>
		</div>
	);
}

export default DashboardChartCourses;