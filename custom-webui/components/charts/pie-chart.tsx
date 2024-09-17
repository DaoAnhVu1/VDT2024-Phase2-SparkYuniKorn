"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface PieChartProps {
    chartTitle: string,
    rawChartData: any,
    keyValue: string,
    description: string,
    colorConfig: { [key: string]: string }
}

export function CustomPieChart({ chartTitle, rawChartData, keyValue, description, colorConfig }: PieChartProps) {

    // Use colorConfig object to assign colors
    const chartData = Object.entries(rawChartData)
        .filter(([status]) => status !== 'total') // Exclude "total"
        .map(([status, count]) => ({
            status,
            count,
            fill: colorConfig[status] || '#000000',
        }));

    const chartConfig = Object.fromEntries(
        Object.keys(rawChartData)
            .filter(status => status !== 'total') // Exclude "total"
            .map(status => [
                status.toLowerCase(),
                {
                    label: status,
                    color: colorConfig[status] || '#000000', // Use colorConfig or fallback to black
                },
            ])
    );

    const totalNumber = React.useMemo(() => {
        return chartData.reduce((acc: any, curr: any) => acc + curr[keyValue], 0)
    }, [chartData, keyValue])

    return (
        <Card className="flex flex-col w-1/4 shadow-md">
            <CardHeader className="flex text-center pb-0 ">
                <CardTitle>{chartTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={10}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalNumber.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {description}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
