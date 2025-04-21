import {
    type LucideIcon,
} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import React from "react"
import { ColorContext } from "@/providers/ColorProvider"

export function NavRecords({
    records,
}: {
    records: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const location = useLocation();
	const colorContext = React.useContext(ColorContext); 

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Historial de Busqueda</SidebarGroupLabel>
            <SidebarMenu>
                {records.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                            className={decodeURIComponent(location.pathname) === item.url 
                                ? `bg-${colorContext?.color}-600 text-white hover:bg-${colorContext?.color}-700 hover:text-white` 
                                : ""
                            }
                            asChild
                        >
                            <Link to={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
