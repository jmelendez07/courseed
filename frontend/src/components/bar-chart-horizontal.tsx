import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
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

interface BarChartHorizontalProps {
    title?: String;
    description?: String;
    chartData: ChartItem[];
    labelValueToolTip?: String;
    className?: String;
} 

interface ChartItem {
    label: String;
    value: number;
}

function BarChartHorizontal({ 
    title = "Bar Chart - Horizontal",
    description = "January - June 2024",
    labelValueToolTip = "value",
    chartData,
    className 
}: BarChartHorizontalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "oklch(0.588 0.158 241.966)",
        },
        value: {
            label: labelValueToolTip
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
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: isDesktop ? -180 : -100,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="label"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="value"
                            layout="vertical"
                            fill="var(--color-desktop)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="label"
                                position="insideLeft"
                                offset={8}
                                fill="#fff"
                                fontSize={12}
                                formatter={(value: string) => value.slice(0, isDesktop ? 30 : 15) + "..."}
                            />
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: string) => value + "⭐"}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default BarChartHorizontal;