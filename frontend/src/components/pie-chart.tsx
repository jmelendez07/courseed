import { LabelList, Pie, PieChart as PieChartRechart } from "recharts";

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

interface PieChartProps {
    title?: string;
    description?: string;
    chartData: ChartItem[];
    className?: string;
}

interface ChartItem {
    label: string;
    value: number;
    fill: string;
}

function renderLabel(props: any) {
    if (typeof props === "string") {
        return props.slice(0, 10) + "...";
    } else {
        return "";
    }
};

function PieChart({
    title = "Pie Chart - Label List",
    description = "January - June 2024",
    chartData,
    className
}: PieChartProps) {

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "oklch(0.588 0.158 241.966)",
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
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] overflow-hidden">
                    <PieChartRechart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="value" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="value" nameKey="label" label>
                            <LabelList
                                dataKey="label"
                                offset={8}
                                fontWeight={2}
                                fontSize={12}
                                className="fill-foreground"
                                formatter={renderLabel}
                            />
                        </Pie>
                    </PieChartRechart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default PieChart;