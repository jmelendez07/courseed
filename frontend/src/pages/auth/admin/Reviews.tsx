import { AppSidebar } from "@/components/app-sidebar";
import BarChartHorizontal from "@/components/bar-chart-horizontal";
import LineChart from "@/components/line-chart";
import RadarChart from "@/components/radar-chart";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import ReviewLarge from "@/components/ui/review-large";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Reviews() {

	const [reviews, setReviews] = React.useState<ReviewCourseUserInterface[]>([]);

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
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{reviews.map((review) => (
								<ReviewLarge key={review.id} review={review} />
							))}
						</div>
						<div className="flex items-center justify-center space-x-2 py-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => { }}
							>
								Mostrar mas reseñas
								<ChevronDown />
							</Button>
						</div>
					</div>
				</SidebarInset>
			</DialogProvider>
		</SidebarProvider>
	);
}

export default Reviews;