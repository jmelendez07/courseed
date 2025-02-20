import {
	GraduationCap,
	LayoutPanelLeft,
	MessageSquareText,
	UserPlus,
	Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import React from "react";
import { DialogContext } from "@/providers/DialogProvider";
import CreateUserForm from "./create-user-form";
import CourseForm from "./course-form";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const dialogContext = React.useContext(DialogContext);

	const userForm = {
		title: "Registrar Nuevo Usuario",
		description: "Añade un nuevo usuario a la plataforma con su correo y una contraseña segura.",
		open: true,
		dialogChildren: <CreateUserForm />
	}

	const courseForm = {
		title: "Crea un Nuevo Curso",
		description: "Añade un nuevo curso a la plataforma con su titulo, precio, duración...",
		open: true,
		dialogChildren: <CourseForm />
	}

	const data = {
		actions: [
			{
				name: "Nuevo Usuario",
				logo: UserPlus,
				action: () => dialogContext?.setContext(userForm)
			},
			{
				name: "Nueva Educación Continuada",
				logo: GraduationCap,
				action: () => dialogContext?.setContext(courseForm)
			},
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
				title: "Educación Continuada",
				icon: GraduationCap,
				items: [
					{
						title: "Ver todos",
						url: "/administrador/educacion",
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
