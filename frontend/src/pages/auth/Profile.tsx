import { AppSidebar } from "@/components/app-sidebar";
import DashboardContentProfile from "@/components/dashboard-content-profile";
import DashboardStatsProfile from "@/components/dashboard-stats-profile";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import ProfileCards from "@/components/ui/profile-cards";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import Theme from "@/components/ui/theme";
import DialogProvider from "@/providers/DialogProvider";

function Profile() {
    return (
        <SidebarProvider>
            <DialogProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Perfil
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Inicio</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-2 px-4">
                            <Color />
                            <Theme />
                        </div>
                    </header>
                    <div className="flex flex-col gap-8 p-8">
                        <DashboardContentProfile />
                        <Separator className="my-4" />
                        <ProfileCards />
                        <Separator className="my-4" />
                        <DashboardStatsProfile />
                    </div>
                </SidebarInset>
            </DialogProvider>
        </SidebarProvider>
    );
}

export default Profile;