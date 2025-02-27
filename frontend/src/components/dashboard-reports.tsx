import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function DashboardReports() {
    return (
        <>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Reportes Automáticos</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        title: "Baja Interacción",
                        description: "5 cursos con baja interacción en los últimos 30 días",
                        icon: TrendingDown,
                        color: "text-yellow-500",
                    },
                    {
                        title: "Reseñas Negativas",
                        description: "2 cursos con aumento de reseñas negativas",
                        icon: Star,
                        color: "text-orange-500",
                    },
                ].map((report, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <report.icon className={`h-5 w-5 ${report.color}`} />
                            <CardTitle className="text-base">{report.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" className="w-full">
                                Ver detalles
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default DashboardReports;