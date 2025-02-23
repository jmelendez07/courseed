import { Area, AreaChart as AreaChartReChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useMediaQuery } from "@/hooks/use-media-query";

interface AreaChartProps {
    title?: string;
    description?: string;
    chartData: ChartItem[];
    labelValueToolTip?: String;
    className?: string;
}

interface ChartItem {
    month: String;
    count: number;
}

function AreaChart({
    title = "Area Chart - Stacked",
    description = "Showing total visitors for the last 6 months",
    chartData = [],
    labelValueToolTip = "count",
    className
}: AreaChartProps) {

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
            <CardContent className="overflow-hidden">
                <ChartContainer config={chartConfig} className="w-full max-h-[220px] overflow-hidden">
                    <AreaChartReChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            top: 20,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, isDesktop ? 5 : 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="oklch(0.588 0.158 241.966)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="oklch(0.588 0.158 241.966)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="count"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.4}
                            stroke="oklch(0.588 0.158 241.966)"
                            stackId="a"
                            type="monotone"
                            dot={{
                                fill: "oklch(0.588 0.158 241.966)",
                            }}
                            activeDot={{
                                r: 5,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={6}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Area>
                    </AreaChartReChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default AreaChart;