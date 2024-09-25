"use client";

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
        color: "#0000FF",
    },
} satisfies ChartConfig;

export function CustomBarChartForTimeStamp({
    rawChartData,
    title,
    keyField,
}: {
    rawChartData: any[];
    title: string;
    keyField: string;
}) {
    const processChartData = (data: any[]) => {
        const dataWithFormattedTime = data.map((entry) => {
            const date = new Date(entry.timestamp / 1000000);
            const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Adjusting for timezone
            const hours = localDate.getUTCHours().toString().padStart(2, "0");
            const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");
            return {
                ...entry,
                time: `${hours}:${minutes}`,
                [keyField]: Number(entry[keyField]), // Dynamic key usage
            };
        });

        const groupedByTime = dataWithFormattedTime.reduce((acc: any, { time, [keyField]: keyValue }) => {
            if (!acc[time]) {
                acc[time] = 0;
            }
            acc[time] += keyValue;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(groupedByTime).map(([time, value]) => ({
            time,
            [keyField]: value, // Use the dynamic keyField here
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
                            top:5
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value} 
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Area
                            dataKey={keyField} 
                            type="bump"
                            fill="#0000FF" 
                            fillOpacity={0.4}
                            stroke="#0000FF" 
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
