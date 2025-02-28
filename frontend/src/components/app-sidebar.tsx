import {
	GraduationCap,
	LayoutPanelLeft,
	MessageSquareText,
	ThumbsUp,
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
import { useAuth } from "@/providers/AuthProvider";
import ROLES from "@/enums/roles";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const dialogContext = React.useContext(DialogContext);
	const authHook = useAuth();

	const isAdmin = (): boolean | undefined => {
		return authHook?.user?.roles?.some(r => r === ROLES.ADMIN);
	}

	const userForm = {
		title: "Registrar Nuevo Usuario",
		description: "Añade un nuevo usuario a la plataforma con su correo y una contraseña segura.",
		open: true,
		dialogChildren: <CreateUserForm />
	}

	const courseForm = {
		title: "Crea un Nuevo Programa",
		description: "Añade un nuevo programa a la plataforma con su titulo, precio, duración...",
		open: true,
		dialogChildren: <CourseForm />
	}

	const dataAdmin = {
		actions: [
			{
				name: "Nuevo Usuario",
				logo: UserPlus,
				action: () => dialogContext?.setContext(userForm)
			},
			{
				name: "Nuevo Programa",
				logo: GraduationCap,
				action: () => dialogContext?.setContext(courseForm)
			},
		],
		navMain: [
			{
				title: "Panel",
				icon: LayoutPanelLeft,
				url: "/administrador"
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
				title: "Educación Continua",
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
				url: "/administrador/reseñas"
			},
		],
	};

	const dataUser = {
		actions: [],
		navMain: [
			{
				title: "Panel",
				icon: LayoutPanelLeft,
				url: "/usuario"
			},
			{
				title: "Reseñas",
				icon: MessageSquareText,
				url: "/usuario/reseñas"
			},
			{
				title: "Likes",
				icon: ThumbsUp,
				url: "/usuario/likes"
			},
		]
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher 
					teams={isAdmin() ? dataAdmin.actions : dataUser.actions} 
					roles={authHook?.user?.roles ? authHook.user.roles : []}
				/>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={isAdmin() ? dataAdmin.navMain : dataUser.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
