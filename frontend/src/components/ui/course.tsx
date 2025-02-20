import { ArrowUpRight, CalendarClock, Edit, GraduationCap, MoreVertical, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CourseInterface from "@/interfaces/course";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

interface CourseComponentProps {
	className?: string;
	course: CourseInterface;
	optionsEnable: boolean;
	handleEdit?: (course: CourseInterface) => void;
	handleDelete?: (course: CourseInterface) => void;
}

function Course({ className, course, optionsEnable, handleEdit, handleDelete }: CourseComponentProps) {

	const getAvgRating = (): number => {
		if (!course.reviews || course.reviews.length === 0) {
			return 0;
		}

		const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
		return totalRating / course.reviews.length;
	}

	const getFormatPrice = (): string => {

		if (course.price === 0) return "Gratuito";

		return course.price
			? course.price.toLocaleString('es-CO', {
				style: 'currency',
				currency: 'COP',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}) + " COP"
			: "Sin información";
	}

	return (
		<Card
			className={`
				flex flex-col bg-white/25 border border-gray-200 rounded-lg 
				hover:shadow-lg transition-shadow duration-300 ${className}
			`}
		>
			<div className="relative">
				<img
					src={course.image}
					alt={course.title}
					className="w-full h-[200px] object-cover rounded-t-lg"
					onError={(e) => {
						e.currentTarget.src = "https://picsum.photos/400/300"
						e.currentTarget.onerror = null
					}}
				/>
				<Badge className={`absolute top-2 ${optionsEnable ? "left-2" : "right-2"}  bg-gray-100 text-gray-800 hover:bg-gray-200`}>
					{course.category.name}
				</Badge>
				{optionsEnable && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-100 text-gray-800 hover:bg-gray-200">
								<MoreVertical className="h-4 w-4" />
								<span className="sr-only">Mostrar Opciones</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => {
								if (handleEdit) handleEdit(course)
							}}>
								<Edit className="mr-2 h-4 w-4" />
								<span>Editar</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => {
								if (handleDelete) handleDelete(course)
							}}>
								<Trash2 className="mr-2 h-4 w-4" />
								<span>Eliminar</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
			<CardHeader className="space-y-1 py-3">
				<CardTitle className="text-xl text-gray-900 line-clamp-3">{course.title}</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow space-y-4 flex flex-col justify-between">
				<div className="space-y-4">
					<p className="text-sm flex items-start gap-2">
						<CalendarClock className="size-5 min-w-5" />
						<span className="text-gray-600 line-clamp-1">{course.duration}</span>
					</p>
					<p className="text-sm flex items-start gap-2">
						<GraduationCap className="size-5 min-w-5" />
						<span className="text-gray-600 line-clamp-1">{course.modality}</span>
					</p>
				</div>
				<div className="flex flex-wrap justify-between gap-x-2 gap-y-1">
					<p className="text-lg font-bold text-gray-900">
						{getFormatPrice()}
					</p>
					<div className="flex items-center gap-1">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className={`w-4 h-4 ${i < getAvgRating() ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
							/>
						))}
						<span className="text-sm text-gray-600 ml-1">({course.reviews ? course.reviews.length : 0})</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full group">
					<a
						href={`/educacion/${course.id}`} 
						target="_blank"
					>
						Ver Información
						<ArrowUpRight className="transition-transform group-hover:translate-x-1" />
					</a>
				</Button>
			</CardFooter>
		</Card>
	);
}

export default Course;