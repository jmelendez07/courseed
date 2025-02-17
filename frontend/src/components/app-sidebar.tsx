import {
	BookPlus,
	GraduationCap,
	LayoutPanelLeft,
	MessageSquareText,
	UserPlus,
	Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import React from "react"
import { DialogContext } from "@/providers/DialogProvider"
import CreateUserForm from "./create-user-form"
import CourseForm from "./course-form"
import UpdateReviewForm from "./update-review-form"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const dialogContext = React.useContext(DialogContext);

	const userForm = {
		title: "Registrar Nuevo Usuario",
		description: "Añade un nuevo usuario a la plataforma con su correo y una contraseña segura.",
		open: true,
		dialogChildren: <CreateUserForm />
	}

	const courseForm = {
		title: "Crear Nuevo Curso",
		description: "description",
		open: true,
		dialogChildren: <CourseForm />
	}

	const reviewForm = {
		title: "Actualizar Reseña",
		description: "Modifica los detalles de la reseña para reflejar la experiencia más reciente.",
		open: true,
		dialogChildren: <UpdateReviewForm />
	}

	const data = {
		actions: [
			{
				name: "Nuevo Usuario",
				logo: UserPlus,
				action: () => dialogContext?.setContext(userForm)
			},
			{
				name: "Nuevo Curso",
				logo: BookPlus,
				action: () => dialogContext?.setContext(courseForm)
			},
			{
				name: "Actualizar Reseña",
				logo: BookPlus,
				action: () => dialogContext?.setContext(reviewForm)
			}
		],
		navMain: [
			{
				title: "Dashboard",
				icon: LayoutPanelLeft,
				items: [
					{
						title: "Inicio",
						url: "/administrador",
					}
				],
			},
			{
				title: "Usuarios",
				icon: Users,
				items: [
					{
						title: "Ver todos",
						url: "/administrador/usuarios",
					},
					{
						title: "Registrar Nuevo",
						action: () => dialogContext?.setContext(userForm)
					},
				],
			},
			{
				title: "Cursos",
				icon: GraduationCap,
				items: [
					{
						title: "Ver todos",
						url: "/administrador/cursos",
					},
					{
						title: "Registrar Nuevo",
						action: () => dialogContext?.setContext(courseForm)
					}
				],
			},
			{
				title: "Reseñas",
				icon: MessageSquareText,
				items: [
					{
						title: "Ver todas",
						url: "/administrador/reseñas",
					}
				],
			},
		],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.actions} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
