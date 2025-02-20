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
import BarChart from "@/components/bar-chart";
import HeadProvider from "@/providers/HeadProvider";
import DialogProvider from "@/providers/DialogProvider";
import { Link } from "react-router-dom";

function Users() {
    // const [users, setUsers] = React.useState<User[]>([
    //     {
    //       "email": "user1@example.com",
    //       "roles": ["admin", "editor"],
    //       "reviews": 12,
    //       "likes": 100,
    //       "createdAt": "2024-08-15T14:32:00Z"
    //     },
    //     {
    //       "email": "user2@example.com",
    //       "roles": ["user"],
    //       "reviews": 5,
    //       "likes": 30,
    //       "createdAt": "2024-06-22T11:47:00Z"
    //     },
    //     {
    //       "email": "user3@example.com",
    //       "roles": ["user", "moderator"],
    //       "reviews": 3,
    //       "likes": 50,
    //       "createdAt": "2023-11-03T17:15:00Z"
    //     },
    //     {
    //       "email": "user4@example.com",
    //       "roles": ["admin"],
    //       "reviews": 20,
    //       "likes": 200,
    //       "createdAt": "2022-01-12T09:25:00Z"
    //     },
    //     {
    //       "email": "user5@example.com",
    //       "roles": ["user", "editor"],
    //       "reviews": 8,
    //       "likes": 75,
    //       "createdAt": "2023-05-30T18:00:00Z"
    //     },
    //     {
    //       "email": "user6@example.com",
    //       "roles": ["user"],
    //       "reviews": 4,
    //       "likes": 20,
    //       "createdAt": "2024-02-02T16:10:00Z"
    //     },
    //     {
    //       "email": "user7@example.com",
    //       "roles": ["admin", "moderator"],
    //       "reviews": 15,
    //       "likes": 150,
    //       "createdAt": "2022-11-28T20:50:00Z"
    //     },
    //     {
    //       "email": "user8@example.com",
    //       "roles": ["editor"],
    //       "reviews": 9,
    //       "likes": 60,
    //       "createdAt": "2023-07-10T08:30:00Z"
    //     },
    //     {
    //       "email": "user9@example.com",
    //       "roles": ["user"],
    //       "reviews": 2,
    //       "likes": 12,
    //       "createdAt": "2024-01-25T07:45:00Z"
    //     },
    //     {
    //       "email": "user10@example.com",
    //       "roles": ["user", "editor"],
    //       "reviews": 11,
    //       "likes": 90,
    //       "createdAt": "2023-09-05T22:05:00Z"
    //     },
    //     {
    //       "email": "user11@example.com",
    //       "roles": ["moderator"],
    //       "reviews": 7,
    //       "likes": 85,
    //       "createdAt": "2023-03-20T13:30:00Z"
    //     },
    //     {
    //       "email": "user12@example.com",
    //       "roles": ["user", "moderator"],
    //       "reviews": 6,
    //       "likes": 40,
    //       "createdAt": "2023-12-15T10:10:00Z"
    //     },
    //     {
    //       "email": "user13@example.com",
    //       "roles": ["admin"],
    //       "reviews": 25,
    //       "likes": 300,
    //       "createdAt": "2021-08-14T15:55:00Z"
    //     },
    //     {
    //       "email": "user14@example.com",
    //       "roles": ["user"],
    //       "reviews": 1,
    //       "likes": 5,
    //       "createdAt": "2024-02-10T12:00:00Z"
    //     },
    //     {
    //       "email": "user15@example.com",
    //       "roles": ["editor", "moderator"],
    //       "reviews": 13,
    //       "likes": 95,
    //       "createdAt": "2023-07-25T19:00:00Z"
    //     },
    //     {
    //       "email": "user16@example.com",
    //       "roles": ["user"],
    //       "reviews": 4,
    //       "likes": 20,
    //       "createdAt": "2024-01-08T14:45:00Z"
    //     },
    //     {
    //       "email": "user17@example.com",
    //       "roles": ["moderator"],
    //       "reviews": 14,
    //       "likes": 140,
    //       "createdAt": "2022-10-05T16:35:00Z"
    //     },
    //     {
    //       "email": "user18@example.com",
    //       "roles": ["user"],
    //       "reviews": 3,
    //       "likes": 25,
    //       "createdAt": "2024-02-05T09:00:00Z"
    //     },
    //     {
    //       "email": "user19@example.com",
    //       "roles": ["admin", "editor"],
    //       "reviews": 9,
    //       "likes": 70,
    //       "createdAt": "2023-04-19T11:20:00Z"
    //     },
    //     {
    //       "email": "user20@example.com",
    //       "roles": ["user"],
    //       "reviews": 5,
    //       "likes": 60,
    //       "createdAt": "2022-06-29T08:00:00Z"
    //     }
    //   ]
    // );

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
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <PieChart />
                        <AreaChart />
                        <BarChart />
                    </div>
                    <UserDataTable />
                </div>
            </SidebarInset>
          </DialogProvider>
        </SidebarProvider>
    );
}

export default Users;