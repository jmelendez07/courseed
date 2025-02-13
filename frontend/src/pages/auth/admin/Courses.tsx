import { AppSidebar } from "@/components/app-sidebar";
import ChartTest from "@/components/chart-test";
import PieChartTest from "@/components/pie-chart-test";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Course from "@/components/ui/course";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import CourseInterface from "@/interfaces/course";
import { ChevronDown } from "lucide-react";
import React from "react";

function Courses() {
	const [courses, setCourses] = React.useState<CourseInterface[]>([
		{
			"id": "1",
			"url": "https://www.example.com/cursos/1",
			"title": "Curso de Desarrollo Web",
			"image": "https://www.example.com/images/curso1.jpg",
			"description": "Aprende a crear sitios web modernos y dinámicos.",
			"prerequisites": "Conocimientos básicos de HTML y CSS.",
			"price": 99.99,
			"duration": "40 horas",
			"modality": "Online",
			"category": {
				"id": "1",
				"name": "Tecnología"
			},
			"institution": {
				"id": "1",
				"name": "Instituto de Tecnología"
			},
			"contents": [
				{ "id": "1", "title": "Introducción al Desarrollo Web", "duration": "5 horas" },
				{ "id": "2", "title": "HTML y CSS Básico", "duration": "10 horas" }
			],
			"likes": [
				{ "id": "1", "userId": "101", "like": true },
				{ "id": "2", "userId": "102", "like": true }
			],
			"reviews": [
				{ "id": "1", "userId": "101", "rating": 5, "comment": "Excelente curso!" },
				{ "id": "2", "userId": "102", "rating": 4, "comment": "Muy bueno, pero podría ser más extenso." }
			]
		},
		{
			"id": "2",
			"url": "https://www.example.com/cursos/2",
			"title": "Curso de Marketing Digital",
			"image": "https://www.example.com/images/curso2.jpg",
			"description": "Aprende las mejores estrategias de marketing para la era digital.",
			"prerequisites": "No se requieren conocimientos previos.",
			"price": 120.00,
			"duration": "50 horas",
			"modality": "Presencial",
			"category": {
				"id": "2",
				"name": "Negocios"
			},
			"institution": {
				"id": "2",
				"name": "Escuela de Marketing"
			},
			"contents": [
				{ "id": "1", "title": "Introducción al Marketing Digital", "duration": "8 horas" },
				{ "id": "2", "title": "SEO y SEM", "duration": "12 horas" }
			],
			"likes": [
				{ "id": "1", "userId": "103", "like": true },
				{ "id": "2", "userId": "104", "like": false }
			],
			"reviews": [
				{ "id": "1", "userId": "103", "rating": 4, "comment": "Buen curso, pero debería cubrir más herramientas." },
				{ "id": "2", "userId": "104", "rating": 3, "comment": "El curso es básico, esperaba algo más avanzado." }
			]
		},
		{
			"id": "3",
			"url": "https://www.example.com/cursos/3",
			"title": "Curso de Python para Principiantes",
			"image": "https://www.example.com/images/curso3.jpg",
			"description": "Aprende Python desde cero y empieza a programar.",
			"prerequisites": "Ninguno.",
			"price": 75.00,
			"duration": "30 horas",
			"modality": "Online",
			"category": {
				"id": "1",
				"name": "Tecnología"
			},
			"institution": {
				"id": "3",
				"name": "Academia de Programación"
			},
			"contents": [
				{ "id": "1", "title": "Instalación y Configuración de Python", "duration": "4 horas" },
				{ "id": "2", "title": "Sintaxis Básica", "duration": "8 horas" }
			],
			"likes": [
				{ "id": "1", "userId": "105", "like": true },
				{ "id": "2", "userId": "106", "like": true }
			],
			"reviews": [
				{ "id": "1", "userId": "105", "rating": 5, "comment": "Excelente para principiantes." },
				{ "id": "2", "userId": "106", "rating": 4, "comment": "Buen curso, me gustaría más ejercicios prácticos." }
			]
		},
		{
			"id": "4",
			"url": "https://www.example.com/cursos/4",
			"title": "Curso de Diseño Gráfico",
			"image": "https://www.example.com/images/curso4.jpg",
			"description": "Conoce las herramientas esenciales del diseño gráfico.",
			"prerequisites": "Conocimientos básicos de informática.",
			"price": 95.50,
			"duration": "45 horas",
			"modality": "Online",
			"category": {
				"id": "3",
				"name": "Arte"
			},
			"institution": {
				"id": "4",
				"name": "Escuela de Diseño"
			},
			"contents": [
				{ "id": "1", "title": "Introducción al Diseño Gráfico", "duration": "6 horas" },
				{ "id": "2", "title": "Herramientas de Diseño: Photoshop", "duration": "12 horas" }
			],
			"likes": [
				{ "id": "1", "userId": "107", "like": true },
				{ "id": "2", "userId": "108", "like": false }
			],
			"reviews": [
				{ "id": "1", "userId": "107", "rating": 5, "comment": "Muy completo, aprendido mucho." },
				{ "id": "2", "userId": "108", "rating": 4, "comment": "Buen curso, pero un poco básico." }
			]
		},
		{
			"id": "5",
			"url": "https://www.example.com/cursos/5",
			"title": "Curso de Inteligencia Artificial",
			"image": "https://www.example.com/images/curso5.jpg",
			"description": "Una introducción al mundo de la Inteligencia Artificial.",
			"prerequisites": "Conocimientos básicos de matemáticas y programación.",
			"price": 199.99,
			"duration": "60 horas",
			"modality": "Online",
			"category": {
				"id": "1",
				"name": "Tecnología"
			},
			"institution": {
				"id": "5",
				"name": "Universidad de Innovación"
			},
			"contents": [
				{ "id": "1", "title": "Introducción a la Inteligencia Artificial", "duration": "8 horas" },
				{ "id": "2", "title": "Aprendizaje Automático", "duration": "15 horas" }
			],
			"likes": [
				{ "id": "1", "userId": "109", "like": true },
				{ "id": "2", "userId": "110", "like": true }
			],
			"reviews": [
				{ "id": "1", "userId": "109", "rating": 5, "comment": "Increíble curso, muy completo." },
				{ "id": "2", "userId": "110", "rating": 4, "comment": "Me gustaría que fuera un poco más práctico." }
			]
		}
	]
	);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Administrador
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Cursos</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid gap-4 md:grid-cols-3">
						<ChartTest />
						<PieChartTest />
						<div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
						{/* <div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" /> */}
					</div>
					<div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100/50 md:min-h-min dark:bg-zinc-800/50" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{courses.map((course) => (
							<Course key={course.id} course={course} optionsEnable={true} />
						))}
					</div>
					<div className="flex items-center justify-center space-x-2 py-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => { }}
						>
							Mostrar mas cursos
							<ChevronDown />
						</Button>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default Courses;