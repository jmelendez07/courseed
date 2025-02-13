import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import ReviewLarge from "@/components/ui/review-large";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import { ChevronDown } from "lucide-react";
import React from "react";

function Reviews() {

	const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([
		{
			id: '1',
			userId: 'user1',
			rating: 5,
			comment: 'Excelente curso, muy completo y bien estructurado.',
			course: {
				id: 'course1',
				url: 'https://example.com/course1',
				title: 'Introducción a la Programación',
				image: 'https://example.com/images/course1.jpg',
				description: 'Un curso básico para aprender los principios de la programación.',
				prerequisites: 'Ninguno',
				price: 49.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat1', name: 'Tecnología' },
				institution: { id: 'inst1', name: 'Academia Tech' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: "5 horas" }],
				reviews: [],
				likes: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '2',
			userId: 'user2',
			rating: 4,
			comment: 'Muy buen curso, pero me gustaría que tuviera más ejemplos prácticos.',
			course: {
				id: 'course2',
				url: 'https://example.com/course2',
				title: 'Diseño Gráfico Básico',
				image: 'https://example.com/images/course2.jpg',
				description: 'Curso inicial para aprender los fundamentos del diseño gráfico.',
				prerequisites: 'Ninguno',
				price: 39.99,
				duration: '3 semanas',
				modality: 'Online',
				category: { id: 'cat2', name: 'Diseño' },
				institution: { id: 'inst2', name: 'Design School' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Herramientas básicas' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '3',
			userId: 'user3',
			rating: 5,
			comment: 'Excelente contenido y bien explicado. Lo recomiendo.',
			course: {
				id: 'course3',
				url: 'https://example.com/course3',
				title: 'Marketing Digital Avanzado',
				image: 'https://example.com/images/course3.jpg',
				description: 'Aprende estrategias avanzadas de marketing digital para mejorar tu negocio.',
				prerequisites: 'Marketing Digital Básico',
				price: 79.99,
				duration: '6 semanas',
				modality: 'Online',
				category: { id: 'cat3', name: 'Marketing' },
				institution: { id: 'inst3', name: 'Digital Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'SEO avanzado' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '4',
			userId: 'user4',
			rating: 3,
			comment: 'Interesante pero un poco difícil de seguir. Necesita más claridad.',
			course: {
				id: 'course4',
				url: 'https://example.com/course4',
				title: 'Python para Principiantes',
				image: 'https://example.com/images/course4.jpg',
				description: 'Aprende a programar en Python desde cero.',
				prerequisites: 'Ninguno',
				price: 29.99,
				duration: '5 semanas',
				modality: 'Online',
				category: { id: 'cat1', name: 'Tecnología' },
				institution: { id: 'inst1', name: 'Academia Tech' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Sintaxis básica de Python' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '5',
			userId: 'user5',
			rating: 5,
			comment: 'Curso muy detallado, lo aprendí todo a mi propio ritmo.',
			course: {
				id: 'course5',
				url: 'https://example.com/course5',
				title: 'Fotografía Digital para Principiantes',
				image: 'https://example.com/images/course5.jpg',
				description: 'Introducción a la fotografía digital para principiantes.',
				prerequisites: 'Ninguno',
				price: 49.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat4', name: 'Arte' },
				institution: { id: 'inst4', name: 'Foto Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Fundamentos de la cámara digital' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '6',
			userId: 'user6',
			rating: 2,
			comment: 'Demasiado básico para lo que esperaba. Necesita más contenido.',
			course: {
				id: 'course6',
				url: 'https://example.com/course6',
				title: 'Cocina para Principiantes',
				image: 'https://example.com/images/course6.jpg',
				description: 'Curso básico de cocina para principiantes.',
				prerequisites: 'Ninguno',
				price: 19.99,
				duration: '3 semanas',
				modality: 'Online',
				category: { id: 'cat5', name: 'Culinaria' },
				institution: { id: 'inst5', name: 'Culinaria School' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Utensilios y técnicas básicas' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '7',
			userId: 'user7',
			rating: 4,
			comment: 'Muy bueno, aunque las clases podrían ser un poco más dinámicas.',
			course: {
				id: 'course7',
				url: 'https://example.com/course7',
				title: 'Gestión de Proyectos Ágiles',
				image: 'https://example.com/images/course7.jpg',
				description: 'Curso sobre metodologías ágiles para la gestión de proyectos.',
				prerequisites: 'Conocimientos básicos en gestión de proyectos',
				price: 69.99,
				duration: '5 semanas',
				modality: 'Online',
				category: { id: 'cat6', name: 'Gestión' },
				institution: { id: 'inst6', name: 'Project Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Introducción a Scrum' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '8',
			userId: 'user8',
			rating: 5,
			comment: 'Aprendí mucho en poco tiempo. Totalmente recomendado.',
			course: {
				id: 'course8',
				url: 'https://example.com/course8',
				title: 'Diseño Web Responsivo',
				image: 'https://example.com/images/course8.jpg',
				description: 'Curso completo para aprender a crear sitios web responsivos.',
				prerequisites: 'Conocimientos básicos de HTML y CSS',
				price: 59.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat2', name: 'Diseño' },
				institution: { id: 'inst7', name: 'Web Design School' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Principios del diseño responsivo' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '9',
			userId: 'user9',
			rating: 4,
			comment: 'Buena información, aunque faltó más práctica.',
			course: {
				id: 'course9',
				url: 'https://example.com/course9',
				title: 'Gestión de Redes Sociales para Negocios',
				image: 'https://example.com/images/course9.jpg',
				description: 'Aprende a gestionar redes sociales para aumentar la visibilidad de tu negocio.',
				prerequisites: 'Ninguno',
				price: 39.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat3', name: 'Marketing' },
				institution: { id: 'inst8', name: 'Social Media Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Estrategias para Instagram' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '10',
			userId: 'user10',
			rating: 5,
			comment: 'Muy buen curso, con ejemplos muy prácticos y fáciles de seguir.',
			course: {
				id: 'course10',
				url: 'https://example.com/course10',
				title: 'Desarrollo de Aplicaciones Móviles con Flutter',
				image: 'https://example.com/images/course10.jpg',
				description: 'Curso avanzado de desarrollo de aplicaciones móviles usando Flutter.',
				prerequisites: 'Conocimientos básicos de programación',
				price: 99.99,
				duration: '8 semanas',
				modality: 'Online',
				category: { id: 'cat1', name: 'Tecnología' },
				institution: { id: 'inst9', name: 'Tech Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Introducción a Flutter' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '11',
			userId: 'user11',
			rating: 3,
			comment: 'El curso es bueno, pero algunas secciones no son muy claras.',
			course: {
				id: 'course11',
				url: 'https://example.com/course11',
				title: 'Introducción a la Inteligencia Artificial',
				image: 'https://example.com/images/course11.jpg',
				description: 'Curso básico para iniciarse en el mundo de la Inteligencia Artificial.',
				prerequisites: 'Ninguno',
				price: 59.99,
				duration: '6 semanas',
				modality: 'Online',
				category: { id: 'cat1', name: 'Tecnología' },
				institution: { id: 'inst10', name: 'AI Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Fundamentos de la IA' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '12',
			userId: 'user12',
			rating: 5,
			comment: 'Curso completo y fácil de entender, aprendí mucho.',
			course: {
				id: 'course12',
				url: 'https://example.com/course12',
				title: 'Producción de Música Electrónica',
				image: 'https://example.com/images/course12.jpg',
				description: 'Curso para aprender a producir música electrónica.',
				prerequisites: 'Conocimientos básicos de música',
				price: 79.99,
				duration: '7 semanas',
				modality: 'Online',
				category: { id: 'cat7', name: 'Música' },
				institution: { id: 'inst11', name: 'Music Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Introducción a la producción digital' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '13',
			userId: 'user13',
			rating: 4,
			comment: 'Muy útil, aunque se podrían añadir más recursos descargables.',
			course: {
				id: 'course13',
				url: 'https://example.com/course13',
				title: 'Emprendimiento para Principiantes',
				image: 'https://example.com/images/course13.jpg',
				description: 'Curso para aprender los fundamentos del emprendimiento.',
				prerequisites: 'Ninguno',
				price: 39.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat8', name: 'Emprendimiento' },
				institution: { id: 'inst12', name: 'Business Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Principios del emprendimiento' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '14',
			userId: 'user14',
			rating: 3,
			comment: 'El curso está bien, pero algunos temas son repetitivos.',
			course: {
				id: 'course14',
				url: 'https://example.com/course14',
				title: 'Inglés para Principiantes',
				image: 'https://example.com/images/course14.jpg',
				description: 'Curso básico de inglés para quienes están empezando.',
				prerequisites: 'Ninguno',
				price: 29.99,
				duration: '6 semanas',
				modality: 'Online',
				category: { id: 'cat9', name: 'Idiomas' },
				institution: { id: 'inst13', name: 'Language Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Vocabulario básico' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '15',
			userId: 'user15',
			rating: 5,
			comment: 'Excelente curso, muy recomendable para quienes quieren iniciarse en el inglés.',
			course: {
				id: 'course15',
				url: 'https://example.com/course15',
				title: 'Desarrollo Web con JavaScript',
				image: 'https://example.com/images/course15.jpg',
				description: 'Curso para aprender a desarrollar sitios web con JavaScript.',
				prerequisites: 'Conocimientos básicos de HTML y CSS',
				price: 69.99,
				duration: '5 semanas',
				modality: 'Online',
				category: { id: 'cat1', name: 'Tecnología' },
				institution: { id: 'inst14', name: 'Web Dev Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Sintaxis básica de JavaScript' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '16',
			userId: 'user16',
			rating: 4,
			comment: 'Es un buen curso, pero faltó más interacción en vivo.',
			course: {
				id: 'course16',
				url: 'https://example.com/course16',
				title: 'Estrategias de SEO para 2025',
				image: 'https://example.com/images/course16.jpg',
				description: 'Curso sobre las últimas estrategias SEO para el 2025.',
				prerequisites: 'Conocimientos básicos en SEO',
				price: 79.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat3', name: 'Marketing' },
				institution: { id: 'inst15', name: 'SEO Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Técnicas de SEO para Google' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '17',
			userId: 'user17',
			rating: 3,
			comment: 'Está bien, pero esperaba más enfoque práctico.',
			course: {
				id: 'course17',
				url: 'https://example.com/course17',
				title: 'Ciberseguridad para Principiantes',
				image: 'https://example.com/images/course17.jpg',
				description: 'Introducción a la ciberseguridad y sus mejores prácticas.',
				prerequisites: 'Ninguno',
				price: 49.99,
				duration: '6 semanas',
				modality: 'Online',
				category: { id: 'cat1', name: 'Tecnología' },
				institution: { id: 'inst16', name: 'Cyber Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Fundamentos de la ciberseguridad' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '18',
			userId: 'user18',
			rating: 5,
			comment: 'Muy bueno, aprendizaje claro y bien explicado.',
			course: {
				id: 'course18',
				url: 'https://example.com/course18',
				title: 'Photoshop para Principiantes',
				image: 'https://example.com/images/course18.jpg',
				description: 'Curso básico de Photoshop para mejorar tus habilidades en diseño gráfico.',
				prerequisites: 'Ninguno',
				price: 49.99,
				duration: '4 semanas',
				modality: 'Online',
				category: { id: 'cat2', name: 'Diseño' },
				institution: { id: 'inst17', name: 'Design Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Herramientas básicas de Photoshop' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '19',
			userId: 'user19',
			rating: 4,
			comment: 'Buena calidad de contenido, aunque algunas lecciones fueron muy breves.',
			course: {
				id: 'course19',
				url: 'https://example.com/course19',
				title: 'Estrategias de Publicidad en Facebook',
				image: 'https://example.com/images/course19.jpg',
				description: 'Aprende a crear campañas publicitarias efectivas en Facebook.',
				prerequisites: 'Ninguno',
				price: 49.99,
				duration: '5 semanas',
				modality: 'Online',
				category: { id: 'cat3', name: 'Marketing' },
				institution: { id: 'inst18', name: 'Facebook Ads Academy' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Creación de anuncios en Facebook' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		},
		{
			id: '20',
			userId: 'user20',
			rating: 5,
			comment: 'Totalmente recomendable. Todo está bien organizado y con excelente material.',
			course: {
				id: 'course20',
				url: 'https://example.com/course20',
				title: 'UX/UI para Principiantes',
				image: 'https://example.com/images/course20.jpg',
				description: 'Curso para aprender los principios del diseño UX/UI.',
				prerequisites: 'Ninguno',
				price: 59.99,
				duration: '6 semanas',
				modality: 'Online',
				category: { id: 'cat2', name: 'Diseño' },
				institution: { id: 'inst19', name: 'Design Institute' },
				contents: [{ id: 'cont1', title: 'Módulo 1', duration: 'Fundamentos de UX/UI' }],
				likes: [],
				reviews: []
			},
			user: {
				id: "user1",
				email: "user@gmail.com",
			}
		}
	]);

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
									<BreadcrumbPage>Reseñas</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
						<div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
						<div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{reviews.map((review) => (
							<ReviewLarge key={review.id} review={review} />
						))}
					</div>
					<div className="flex items-center justify-center space-x-2 py-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {}}
						>
							Mostrar mas reseñas
							<ChevronDown />
						</Button>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default Reviews;