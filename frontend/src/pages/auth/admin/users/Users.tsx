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
import UserDataTable from "@/components/user-data-table";
import PieChart from "@/components/pie-chart";
import AreaChart from "@/components/area-chart";
import HeadProvider from "@/providers/HeadProvider";
import DialogProvider from "@/providers/DialogProvider";
import { Link } from "react-router-dom";

function Users() {
    return (
        <SidebarProvider>
          <DialogProvider>
            <HeadProvider title="Administrador | Usuarios" />
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
                                    <BreadcrumbPage>Usuarios</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-[100vw]">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <PieChart chartData={[]} />
                        <AreaChart className="md:col-span-2" />
                    </div>
                    <UserDataTable />
                </div>
            </SidebarInset>
          </DialogProvider>
        </SidebarProvider>
    );
}

export default Users;