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
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import { Input } from "@/components/ui/input";
import ReviewLarge from "@/components/ui/review-large";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import useReview from "@/hooks/useReview";
import useUser from "@/hooks/useUser";
import DialogProvider from "@/providers/DialogProvider";
import HeadProvider from "@/providers/HeadProvider";
import { ChevronDown, LoaderCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

function Reviews() {

	const review = useReview();
	const user = useUser({});

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
						<div className="grid grid-cols-1 items-center md:grid-cols-[1fr,auto] gap-x-4">
							<form
								onSubmit={e => {
									e.preventDefault();
									review.setParams({
										...review.params,
										searchSubmit: true,
										pageNumber: 0
									});
									review.handleFetch();
								}}
								className="flex items-center py-4 gap-2"
							>
								<Input
									type="text"
									disabled={review.loading}
									value={review.params.searchText}
									placeholder="Buscar por calificación, descripción..."
									onChange={e => {
										if (e.target.value.trim() === "") {
											review.setParams({
												...review.params,
												searchSubmit: false
											});
										}
										review.setParams({
											...review.params,
											searchText: e.target.value
										});
									}}
									className="max-w-sm"
								/>
								<Button
									type="submit"
									disabled={review.loading}
								>
									{review.loading ? <LoaderCircle className="animate-spin" /> : <Search />}
								</Button>
							</form>
							<ComboBoxResponsive
								placeholder="Filtrar por Usuario..."
								labelAll="Todos los usuarios"
								statuses={user.users.map(u => { return { id: u.id, name: u.email } })}
								selectedStatus={ review.params.user 
									? {id: review.params.user.id, name: review.params.user.email}
									: null
								}
								setSelectedStatus={u => {
									review.setParams({
										...review.params,
										user: { id: u?.id, email: u?.name ? u.name : '' },
										pageNumber: 0
									});
								}}
								pagination={!user.isLastPage}
								onPaginate={() => user.setPageNumber(user.pageNumber + 1)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{review.reviews.map((r) => (
								<ReviewLarge key={r.id} review={r} />
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