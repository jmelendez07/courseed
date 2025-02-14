import { AppSidebar } from "@/components/app-sidebar";
import BarChart from "@/components/bar-chart";
import BarChartHorizontal from "@/components/bar-chart-horizontal";
import PieChartTest from "@/components/pie-chart-test";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import Course from "@/components/ui/course";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import useCourse from "@/hooks/useCourse";
import useInstitution from "@/hooks/useInstitution";
import DialogProvider from "@/providers/DialogProvider";

import HeadProvider from "@/providers/HeadProvider";

import { ChevronDown, ChevronUp, LoaderCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

function Courses() {

	const course = useCourse();
	const institution = useInstitution();

	return (
		<SidebarProvider>
			<DialogProvider>
				<HeadProvider title="Administrador | Cursos" />
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
										<BreadcrumbPage>
											{course.totalCourses} Cursos
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						<div className="grid gap-4 md:grid-cols-3">
							<BarChart />
							<PieChartTest />
							<BarChartHorizontal />
						</div>
						<div className="grid grid-cols-1 items-center md:grid-cols-[1fr,auto] gap-x-4">
							<form onSubmit={e => {
								e.preventDefault();
								course.setParams({
									...course.params,
									institution: null,
									searchSubmit: true,
									pageNumber: 0
								});
								course.handleFetch();
							}} className="flex items-center py-4 gap-2">
								<Input
									type="text"
									disabled={course.loading}
									value={course.params.searchText}
									placeholder="Buscar por titulo, descripción, duracion..."
									onChange={e => {
										if (e.target.value.trim() === "") {
											course.setParams({
												...course.params,
												searchSubmit: false
											});
										}
										course.setParams({
											...course.params,
											searchText: e.target.value
										});
									}}
									className="max-w-sm"
								/>
								<Button
									type="submit"
									disabled={course.loading}
								>
									{course.loading ? <LoaderCircle className="animate-spin" /> : <Search />}
								</Button>
							</form>
							<ComboBoxResponsive
								placeholder="Buscar Instituciones..."
								statuses={institution.institutions}
								selectedStatus={course.params.institution}
								setSelectedStatus={i => {
									course.setParams({
										...course.params,
										institution: i,
										pageNumber: 0
									});
								}}
								pagination={!institution.isLastPage}
								onPaginate={() => institution.setPageNumber(institution.pageNumber + 1)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{course.courses.map((c) => (
								<Course key={c.id} course={c} optionsEnable={true} />
							))}
						</div>
						<div className="flex items-center justify-center space-x-2 py-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									if (course.isLastPage) {
										window.scrollTo({ top: 0, behavior: "smooth" });
									} else {
										course.setParams({
											...course.params,
											pageNumber: course.params.pageNumber + 1
										});
									}
								}}
								disabled={course.loading}
							>
								{course.isLastPage ? (
									<>
										¡Lo has visto todo! Vuelve arriba.
										<ChevronUp />
									</>
								) : (
									<>
										Mostrar mas cursos
										{course.loading ? (
											<LoaderCircle className="animate-spin" />
										) : (
											<ChevronDown />
										)}
									</>
								)}
							</Button>
						</div>
					</div>
				</SidebarInset>
			</DialogProvider>
		</SidebarProvider>
	);
}

export default Courses;