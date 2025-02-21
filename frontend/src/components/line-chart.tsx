import { CartesianGrid, LabelList, Line, LineChart as LineChartRechart, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/use-media-query";

interface LineChartProps {
    title?: string;
    description?: string;
    chartData: ChartItem[];
    labelValueToolTip?: String;
    className?: String;
}

interface ChartItem {
    month: String;
    count: number;
}

function LineChart({ 
    title="Line Chart - Label",
    description="January - June 2024",
    labelValueToolTip="count",
    chartData,
    className
}: LineChartProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "oklch(0.588 0.158 241.966)",
        },
        count: {
            label: labelValueToolTip,
        }
    } satisfies ChartConfig

    return (
        <Card className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-full overflow-hidden">
                <ChartContainer config={chartConfig} className="w-full max-h-[220px] overflow-hidden">
                    <LineChartRechart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => isDesktop ? value.slice(0, 15) + "..." : value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    indicator="line" 
                                    label="hola"
                                />
                            }
                        />
                        <Line
                            dataKey="count"
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-desktop)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                    </LineChartRechart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default LineChart;