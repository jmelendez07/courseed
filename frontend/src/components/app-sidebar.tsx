import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  GraduationCap,
  LayoutPanelLeft,
  MessageSquareText,
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  actions: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
          url: "/administrador/usuarios/nuevo",
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
          url: "/administrador/cursos/nuevo",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.actions} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
