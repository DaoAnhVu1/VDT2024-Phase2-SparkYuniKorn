"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A linear area chart";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#0000FF", // Changed color to blue
    },
} satisfies ChartConfig;

export function CustomBarChartForTimeStamp({ rawChartData, title }: { rawChartData: any[], title: string }) {
    const processChartData = (data: any[]) => {
        const dataWithFormattedTime = data.map(entry => {
            const date = new Date(entry.timestamp / 1000000);
            const localDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
            const hours = localDate.getUTCHours().toString().padStart(2, '0');
            const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
            return {
                ...entry,
                time: `${hours}:${minutes}`,
                totalApplications: Number(entry.totalApplications)
            };
        });

        // Group by time
        const groupedByTime = dataWithFormattedTime.reduce((acc: any, { time, totalApplications }) => {
            if (!acc[time]) {
                acc[time] = 0;
            }
            acc[time] += totalApplications;
            return acc;
        }, {} as Record<string, number>);

        // Convert grouped data to chart format
        return Object.entries(groupedByTime).map(([time, totalApplications]) => ({
            time,
            totalApplications
        }));
    };

    const processedData = processChartData(rawChartData);

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex w-full">
                <ChartContainer config={chartConfig} className="h-48 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={processedData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value} // Show time as HH:mm
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Area
                            dataKey="totalApplications"
                            type="linear"
                            fill="#0000FF" // Changed color to blue
                            fillOpacity={0.4}
                            stroke="#0000FF" // Changed color to blue
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
