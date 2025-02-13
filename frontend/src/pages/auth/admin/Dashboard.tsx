import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <SidebarProvider>
            <DialogProvider>
                <HeadProvider title="Administrador" />
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <Link to="/administrador" className="hover:text-gray-800">
											Administrador
										</Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Inicio</BreadcrumbPage>
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
                        <div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100/50 md:min-h-min dark:bg-zinc-800/50" />
                    </div>
                </SidebarInset>
            </DialogProvider>
        </SidebarProvider>
    );
}

export default Dashboard;