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
    chartConfig?: ChartConfig;
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
    chartConfig = {},
    className
}: PieChartProps) {
    return (
        <Card className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr] ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square [&_.recharts-text]:fill-background max-h-[250px]"
                >
                    <PieChartRechart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="value" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="value" nameKey="label" label>
                            <LabelList
                                dataKey="label"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
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