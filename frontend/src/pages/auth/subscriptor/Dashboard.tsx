import { AppSidebar } from "@/components/app-sidebar";
import DashboardCategoriesAnalytics from "@/components/dashboard/dashboard-categories-analytics";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Color from "@/components/ui/Color";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Theme from "@/components/ui/theme";
import { useAuth } from "@/providers/AuthProvider";
import HeadProvider from "@/providers/HeadProvider";

function Dashboard() {

    const authHook = useAuth();

    return (
        <SidebarProvider>
            <AppSidebar />
            <HeadProvider title="Suscriptor" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Suscriptor
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
                <main className="flex-1 p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Bienvenid@, {authHook?.getName()}</h1>
                        <p className="text-muted-foreground mb-6">
                            Visualiza y analiza predicciones sobre programas académicos y categorias populares.
                        </p>

                        <Tabs defaultValue="futuros" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="futuros">Programas en Periodo Futuro</TabsTrigger>
                                <TabsTrigger value="tendencias">Tendencias de Programas</TabsTrigger>
                                <TabsTrigger value="facultad">Programas por Categoria</TabsTrigger>
                            </TabsList>

                            <TabsContent value="futuros" className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <h3 className="text-lg font-medium mb-2">Predicción del número de programas en un periodo futuro</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Utilizando modelos de regresión para predecir el número de programas en periodos futuros.
                                    </p>
                                    <div className="h-[300px] bg-muted/50 rounded-md flex items-center justify-center">
                                        <p className="text-muted-foreground">Gráfico de predicción de programas</p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Periodo Actual</div>
                                            <div className="text-2xl font-bold">245</div>
                                            <div className="text-xs text-muted-foreground">programas</div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Predicción Próximo Periodo</div>
                                            <div className="text-2xl font-bold">278</div>
                                            <div className="text-xs text-muted-foreground">programas estimados</div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Crecimiento</div>
                                            <div className="text-2xl font-bold text-green-600">+13.5%</div>
                                            <div className="text-xs text-muted-foreground">respecto al periodo anterior</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="tendencias" className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <h3 className="text-lg font-medium mb-2">Tendencia en programas académicos populares</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Análisis de la tendencia de programas académicos a lo largo de los años.
                                    </p>
                                    <div className="h-[300px] bg-muted/50 rounded-md flex items-center justify-center">
                                        <p className="text-muted-foreground">Gráfico de tendencias de programas</p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Programa con Mayor Crecimiento</div>
                                            <div className="text-xl font-bold">Ingeniería de Software</div>
                                            <div className="text-xs text-muted-foreground">+24% en los últimos 3 años</div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Programa con Menor Crecimiento</div>
                                            <div className="text-xl font-bold">Administración Tradicional</div>
                                            <div className="text-xs text-muted-foreground">-8% en los últimos 3 años</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="facultad" className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <h3 className="text-lg font-medium mb-2">Programas por categoria en el próximo periodo</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Predicción del número de programas por cateogria para el próximo periodo académico.
                                    </p>
                                    <div className="h-[300px] bg-muted/50 rounded-md flex items-center justify-center">
                                        <p className="text-muted-foreground">Gráfico de predicción por categoria</p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Categoria de Ingeniería</div>
                                            <div className="text-2xl font-bold">156</div>
                                            <div className="text-xs text-green-600">+18% vs periodo anterior</div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Categoria de Ciencias Económicas</div>
                                            <div className="text-2xl font-bold">98</div>
                                            <div className="text-xs text-green-600">+5% vs periodo anterior</div>
                                        </div>
                                        <div className="p-4 border rounded-md">
                                            <div className="text-sm font-medium text-muted-foreground">Categoria de Humanidades</div>
                                            <div className="text-2xl font-bold">74</div>
                                            <div className="text-xs text-red-600">-3% vs periodo anterior</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <DashboardCategoriesAnalytics />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default Dashboard;