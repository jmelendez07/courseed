import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, Eye, Star, ThumbsDown, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/AuthProvider";
import DashboardCourseCarousel from "./dashboard-course-carrousel";
import CategoryCharts from "../charts/CategoryCharts";

const popularCategories = [
    {
        id: 1,
        name: "Desarrollo Web",
        views: 12500,
        reviews: 4.8,
        growth: 23,
        isCreatedByUser: true,
    },
    {
        id: 2,
        name: "Inteligencia Artificial",
        views: 10200,
        reviews: 4.7,
        growth: 45,
        isCreatedByUser: false,
    },
    {
        id: 3,
        name: "Diseño UX/UI",
        views: 8700,
        reviews: 4.6,
        growth: 18,
        isCreatedByUser: true,
    },
    {
        id: 4,
        name: "Ciencia de Datos",
        views: 7800,
        reviews: 4.5,
        growth: 32,
        isCreatedByUser: false,
    },
    {
        id: 5,
        name: "Desarrollo Móvil",
        views: 6500,
        reviews: 4.4,
        growth: 15,
        isCreatedByUser: true,
    },
]

const predictedCategories = [
    {
        id: 1,
        name: "Blockchain y Web3",
        confidence: 92,
        trend: "up",
        isCreatedByUser: false,
    },
    {
        id: 2,
        name: "Inteligencia Artificial Generativa",
        confidence: 88,
        trend: "up",
        isCreatedByUser: true,
    },
    {
        id: 3,
        name: "Ciberseguridad",
        confidence: 85,
        trend: "up",
        isCreatedByUser: false,
    },
    {
        id: 4,
        name: "Desarrollo Sostenible",
        confidence: 78,
        trend: "up",
        isCreatedByUser: true,
    },
    {
        id: 5,
        name: "Realidad Aumentada",
        confidence: 75,
        trend: "up",
        isCreatedByUser: false,
    },
]

const decliningCategories = [
    {
        id: 1,
        name: "jQuery",
        decline: 68,
        trend: "down",
        isCreatedByUser: true,
    },
    {
        id: 2,
        name: "Flash",
        decline: 95,
        trend: "down",
        isCreatedByUser: false,
    },
    {
        id: 3,
        name: "SOAP APIs",
        decline: 72,
        trend: "down",
        isCreatedByUser: true,
    },
    {
        id: 4,
        name: "Objective-C",
        decline: 65,
        trend: "down",
        isCreatedByUser: false,
    },
    {
        id: 5,
        name: "PHP Legacy",
        decline: 58,
        trend: "down",
        isCreatedByUser: true,
    },
]

const topCourses = [
    {
        id: 1,
        title: "Desarrollo Web Fullstack 2024",
        instructor: "María González",
        category: "Desarrollo Web",
        rating: 4.9,
        views: 45000,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
    },
    {
        id: 2,
        title: "Masterclass de React y Next.js",
        instructor: "Carlos Pérez",
        category: "Desarrollo Web",
        rating: 4.8,
        views: 38000,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: false,
    },
    {
        id: 3,
        title: "Inteligencia Artificial para Principiantes",
        instructor: "Ana Rodríguez",
        category: "Inteligencia Artificial",
        rating: 4.9,
        views: 42000,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
    },
    {
        id: 4,
        title: "Diseño UX/UI Avanzado",
        instructor: "Roberto Sánchez",
        category: "Diseño UX/UI",
        rating: 4.7,
        views: 32000,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
    },
    {
        id: 5,
        title: "Python para Ciencia de Datos",
        instructor: "Laura Martínez",
        category: "Ciencia de Datos",
        rating: 4.8,
        views: 36000,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: false,
    },
]

const unwatchedCourses = [
    {
        id: 1,
        title: "Programación en jQuery",
        instructor: "Pedro Gómez",
        category: "jQuery",
        rating: 3.5,
        views: 1200,
        viewsDecline: 85,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
    },
    {
        id: 2,
        title: "Desarrollo con Flash",
        instructor: "Sofía Ruiz",
        category: "Flash",
        rating: 3.2,
        views: 800,
        viewsDecline: 92,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: false,
    },
    {
        id: 3,
        title: "Integración con SOAP APIs",
        instructor: "Miguel Torres",
        category: "SOAP APIs",
        rating: 3.4,
        views: 1500,
        viewsDecline: 78,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
    },
    {
        id: 4,
        title: "Desarrollo iOS con Objective-C",
        instructor: "Carmen Díaz",
        category: "Objective-C",
        rating: 3.6,
        views: 1800,
        viewsDecline: 72,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: false,
    },
    {
        id: 5,
        title: "PHP Legacy para Aplicaciones Web",
        instructor: "Javier López",
        category: "PHP Legacy",
        rating: 3.3,
        views: 1600,
        viewsDecline: 65,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
    },
]

const poorRatedCourses = [
    {
        id: 1,
        title: "Introducción a la Programación",
        instructor: "Fernando Vega",
        category: "Desarrollo Web",
        rating: 2.4,
        views: 8500,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
        issues: ["Contenido desactualizado", "Explicaciones confusas"],
    },
    {
        id: 2,
        title: "Bases de Datos SQL",
        instructor: "Elena Castro",
        category: "Bases de Datos",
        rating: 2.6,
        views: 7200,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: false,
        issues: ["Ejemplos poco prácticos", "Ritmo demasiado rápido"],
    },
    {
        id: 3,
        title: "Marketing Digital Básico",
        instructor: "Raúl Moreno",
        category: "Marketing",
        rating: 2.3,
        views: 6800,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
        issues: ["Contenido superficial", "Falta de ejemplos reales"],
    },
    {
        id: 4,
        title: "Excel para Negocios",
        instructor: "Marta Jiménez",
        category: "Ofimática",
        rating: 2.5,
        views: 9200,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: false,
        issues: ["Problemas técnicos", "Audio de baja calidad"],
    },
    {
        id: 5,
        title: "Fotografía para Principiantes",
        instructor: "Daniel Ortiz",
        category: "Fotografía",
        rating: 2.2,
        views: 5400,
        image: "/placeholder.svg?height=200&width=350",
        isCreatedByUser: true,
        issues: ["Explicaciones confusas", "Falta de estructura"],
    },
]

function DashboardCategoriesAnalytics() {

    const authHook = useAuth();

    const [viewFilter, setViewFilter] = React.useState("all")

    const filteredPopular =
        viewFilter === "mine" ? popularCategories.filter((cat) => cat.isCreatedByUser) : popularCategories

    const filteredPredicted =
        viewFilter === "mine" ? predictedCategories.filter((cat) => cat.isCreatedByUser) : predictedCategories

    const filteredDeclining =
        viewFilter === "mine" ? decliningCategories.filter((cat) => cat.isCreatedByUser) : decliningCategories

    const filteredTopCourses = viewFilter === "mine" ? topCourses.filter((course) => course.isCreatedByUser) : topCourses

    const filteredUnwatchedCourses =
        viewFilter === "mine" ? unwatchedCourses.filter((course) => course.isCreatedByUser) : unwatchedCourses

    const filteredPoorRatedCourses =
        viewFilter === "mine" ? poorRatedCourses.filter((course) => course.isCreatedByUser) : poorRatedCourses

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-[100vw]">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bienvenid@, {authHook?.getName()}</h1>
                    <p className="text-muted-foreground">Continúa desde donde lo dejaste</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={viewFilter} onValueChange={setViewFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Ver categorías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="mine">Solo mis categorías</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="grid gap-4 grid-cols-1">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Cursos Destacados</CardTitle>
                                    <CardDescription>Cursos con mejores vistas y reseñas</CardDescription>
                                </div>
                                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                                    <Star className="mr-1 h-3 w-3" />
                                    Top Rated
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DashboardCourseCarousel courses={filteredTopCourses} type="top" />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Cursos Sin Visualizaciones</CardTitle>
                                        <CardDescription>Cursos que ya no son vistos</CardDescription>
                                    </div>
                                    <Badge variant="destructive">
                                        <Eye className="mr-1 h-3 w-3" />
                                        Baja Visibilidad
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DashboardCourseCarousel courses={filteredUnwatchedCourses} type="unwatched" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Cursos Mal Valorados</CardTitle>
                                        <CardDescription>Cursos con reseñas negativas</CardDescription>
                                    </div>
                                    <Badge variant="destructive">
                                        <ThumbsDown className="mr-1 h-3 w-3" />
                                        Baja Calificación
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DashboardCourseCarousel courses={filteredPoorRatedCourses} type="poor" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Análisis de Categorías</CardTitle>
                        <CardDescription>Visualización de tendencias y métricas clave</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryCharts
                            popularCategories={filteredPopular}
                            predictedCategories={filteredPredicted}
                            decliningCategories={filteredDeclining}
                        />
                    </CardContent>
                </Card>
                <Tabs defaultValue="popular" className="space-y-4">
                    <div className="max-w-full overflow-auto">
                        <TabsList>
                            <TabsTrigger value="popular">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Categorías Populares
                            </TabsTrigger>
                            <TabsTrigger value="predicted">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Predicciones
                            </TabsTrigger>
                            <TabsTrigger value="declining">
                                <TrendingDown className="mr-2 h-4 w-4" />
                                En Declive
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="popular" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categorías Más Populares</CardTitle>
                                <CardDescription>Las categorías de programas con más vistas y mejores reseñas.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="py-4">Categoría</TableHead>
                                            <TableHead className="py-4 text-right">Vistas</TableHead>
                                            <TableHead className="py-4 text-right">Reseñas</TableHead>
                                            <TableHead className="py-4 text-right">Crecimiento</TableHead>
                                            <TableHead className="py-4">Creador</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPopular.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="py-4 font-medium">{category.name}</TableCell>
                                                <TableCell className="py-4 text-right">{category.views.toLocaleString()}</TableCell>
                                                <TableCell className="py-4 text-right">{category.reviews}/5.0</TableCell>
                                                <TableCell className="py-4 text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 rounded-full text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-800"
                                                    >
                                                        +{category.growth}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser ? (
                                                        <Badge variant="secondary" className="rounded-full">Tú</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full">Otros</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="predicted" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Predicciones para el Próximo Mes</CardTitle>
                                <CardDescription>Categorías que se prevé tendrán alta demanda en el próximo mes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="py-4">Categoría</TableHead>
                                            <TableHead className="py-4 text-right">Confianza</TableHead>
                                            <TableHead className="py-4">Tendencia</TableHead>
                                            <TableHead className="py-4">Creador</TableHead>
                                            <TableHead className="py-4"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPredicted.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="py-4 font-medium">{category.name}</TableCell>
                                                <TableCell className="py-4 text-right">{category.confidence}%</TableCell>
                                                <TableCell className="py-4">
                                                    {category.trend === "up" ? (
                                                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 rounded-full">
                                                            <TrendingUp className="mr-1 h-3 w-3" />
                                                            En aumento
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="destructive" className="rounded-full">
                                                            <TrendingDown className="mr-1 h-3 w-3" />
                                                            En declive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser ? (
                                                        <Badge variant="secondary" className="rounded-full">Tú</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full">Otros</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {!category.isCreatedByUser && (
                                                        <Button variant="outline" size="sm">
                                                            <BookOpen className="mr-1 h-3 w-3" />
                                                            Crear programa
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="declining" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categorías en Declive</CardTitle>
                                <CardDescription>Categorías que están perdiendo relevancia y demanda.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="py-4">Categoría</TableHead>
                                            <TableHead className="py-4 text-right">Declive</TableHead>
                                            <TableHead className="py-4">Tendencia</TableHead>
                                            <TableHead className="py-4">Creador</TableHead>
                                            <TableHead className="py-4"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDeclining.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="py-4 font-medium">{category.name}</TableCell>
                                                <TableCell className="py-4 text-right">{category.decline}%</TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="destructive" className="rounded-full">
                                                        <TrendingDown className="mr-1 h-3 w-3" />
                                                        En declive
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser ? (
                                                        <Badge variant="secondary" className="rounded-full">Tú</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-full">Otros</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {category.isCreatedByUser && (
                                                        <Button variant="outline" size="sm">
                                                            Actualizar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default DashboardCategoriesAnalytics;