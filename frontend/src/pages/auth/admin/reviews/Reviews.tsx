import { AppSidebar } from "@/components/app-sidebar";
import BarChartHorizontal from "@/components/bar-chart-horizontal";
import DashboardContentReviews from "@/components/dashboard-content-reviews";
import LineChart from "@/components/line-chart";
import RadarChart from "@/components/radar-chart";
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

function Reviews() {
	return (
		<SidebarProvider>
			<DialogProvider>
				<HeadProvider title="Administrador | Reseñas" />
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
										<BreadcrumbPage>Reseñas</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						<div className="grid auto-rows-min gap-4 md:grid-cols-3">
							<LineChart />
							<BarChartHorizontal />
							<RadarChart
								title="Distribución de Reseñas por Institución"
								description="January - June 2024"
							/>
						</div>
						<DashboardContentReviews />
					</div>
				</SidebarInset>
			</DialogProvider>
		</SidebarProvider>
	);
}

export default Reviews;