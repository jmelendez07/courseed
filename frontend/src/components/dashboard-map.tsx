import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

function DashboardMap() {



    return (
        <>
            <div className="flex items-center">
                <h2 className="text-xl font-semibold">Distribución Geográfica de Usuarios</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 max-h-full xl:grid-rows-1 gap-4 items-start">
                <Card className="xl:col-span-3">
                    <CardContent className="p-0">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                            <div className="absolute inset-0 bg-gray-200" />
                            <div className="hidden md:block absolute bottom-4 left-4 right-4">
                                <div className="grid grid-cols-5 gap-2">
                                    {[
                                        { region: "América", users: "4,256", color: "bg-blue-500" },
                                        { region: "Europa", users: "2,187", color: "bg-green-500" },
                                        { region: "Asia", users: "1,543", color: "bg-yellow-500" },
                                        { region: "África", users: "876", color: "bg-red-500" },
                                        { region: "Oceanía", users: "387", color: "bg-purple-500" },
                                    ].map((region, i) => (
                                        <Card key={i} className="bg-background/80 backdrop-blur-sm">
                                            <CardHeader className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-3 w-3 rounded-full ${region.color}`} />
                                                    <CardTitle className="text-sm">{region.region}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <p className="text-lg font-bold">{region.users}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="">
                    <div className="pb-4 md:p-4">
                        <h3 className="text-xl font-semibold">Cursos por Institución</h3>
                        <p className="text-base">Total de cursos activos</p>
                    </div>
                    <div className="p-0">
                        <ScrollArea className="h-[20rem]">
                            <div className="space-y-2 md:p-4">
                                {[
                                    {
                                        institution: "Universidad de Stanford",
                                        courses: 156,
                                        trend: "+12%",
                                    },
                                    {
                                        institution: "MIT",
                                        courses: 143,
                                        trend: "+8%",
                                    },
                                    {
                                        institution: "Harvard University",
                                        courses: 128,
                                        trend: "+5%",
                                    },
                                    {
                                        institution: "Universidad de Barcelona",
                                        courses: 98,
                                        trend: "+15%",
                                    },
                                    {
                                        institution: "Universidad de São Paulo",
                                        courses: 87,
                                        trend: "+10%",
                                    },
                                    {
                                        institution: "Universidad de Tokyo",
                                        courses: 76,
                                        trend: "+7%",
                                    },
                                    {
                                        institution: "Universidad de Oxford",
                                        courses: 72,
                                        trend: "+4%",
                                    },
                                    {
                                        institution: "ETH Zürich",
                                        courses: 68,
                                        trend: "+6%",
                                    },
                                    {
                                        institution: "Universidad de Melbourne",
                                        courses: 64,
                                        trend: "+9%",
                                    },
                                    {
                                        institution: "Universidad de Cape Town",
                                        courses: 52,
                                        trend: "+11%",
                                    },
                                    {
                                        institution: "Universidad Nacional Autónoma de México",
                                        courses: 48,
                                        trend: "+13%",
                                    },
                                    {
                                        institution: "Tsinghua University",
                                        courses: 45,
                                        trend: "+8%",
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 dark:border-zinc-800"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">{item.institution}</p>
                                            <p className="text-sm text-muted-foreground">{item.courses} cursos</p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={item.trend.startsWith("+") ? "text-green-500" : "text-red-500"}
                                        >
                                            {item.trend}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardMap;