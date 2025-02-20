import { Bar, BarChart as BarChartRechart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const chartConfig = {
    bar1: {
        label: "Desktop",
        color: "rgba(2, 132, 199)",
    },
    bar2: {
        label: "Mobile",
        color: "#0ea5e9",
    },
} satisfies ChartConfig

interface BarChartProps {
    title?: string;
    chartData: ChartItem[];
    description?: string;
    className?: string;
}

interface ChartItem {
    label: string;
    bar1: number;
    bar2: number;
}

function BarChart({ 
    title="Bar Chart - Multiple",
    description="January - June 2024",
    chartData,
    className 
}: BarChartProps) {
    return (
        <Card
            className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}
        >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent
                className="max-h-full overflow-hidden"
            >
                <ChartContainer config={chartConfig} className="w-full max-h-[250px] overflow-hidden">
                    <BarChartRechart accessibilityLayer data={chartData}>
                        <CartesianGrid stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                indicator="dot"
                            />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="bar1" fill="var(--color-bar1)" radius={4} />
                        <Bar dataKey="bar2" fill="var(--color-bar2)" radius={4} />
                    </BarChartRechart>
                </ChartContainer>
            </CardContent>
        </Card>

    );
}

export default BarChart;