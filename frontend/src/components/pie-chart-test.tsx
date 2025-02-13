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

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "#93c5fd",
    },
    safari: {
        label: "Safari",
        color: "#60a5fa",
    },
    firefox: {
        label: "Firefox",
        color: "#3b82f6",
    },
    edge: {
        label: "Edge",
        color: "#1e3a8a",
    },
    other: {
        label: "Other",
        color: "#1d4ed8",
    },
} satisfies ChartConfig

function PieChart() {
    return (
        <Card className="bg-white border border-gray-200 rounded-lg hover:shadow-lg 
            transition-shadow duration-300 grid grid-rows-[auto_1fr]">
            <CardHeader>
                <CardTitle>Pie Chart - Label List</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[220px] [&_.recharts-text]:fill-background"
                >
                    <PieChartRechart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                        />
                        <Pie data={chartData} label dataKey="visitors">
                            <LabelList
                                dataKey="browser"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChartRechart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default PieChart;