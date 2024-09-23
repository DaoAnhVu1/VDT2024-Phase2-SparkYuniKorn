import axios from "axios"
import { env } from "process"
import PartitionUI from "./_components/partition-ui"
import { CustomPieChart } from "@/components/charts/pie-chart"
import ApplicationHistoryUI from "./_components/application-history-ui"
import ContainerHistoryUI from "./_components/container-history"
import { getApplicationPieChartColorConfig, getContainersPieChartColorConfig } from "@/utils/chartColorConfig"

export default async function DashboardPage() {
    try {
        const response = await axios.get("http://localhost:9889/ws/v1/partitions")
        const data = response.data[0]

        return (
            <div className="p-5 flex flex-col min-h-screen h-screen">
                <h1 className="text-2xl font-semibold mb-5 flex justify-center items-center h-20">
                    Dashboard
                </h1>

                <PartitionUI partitionData={data} />

                <div className="flex w-full mt-5 gap-5">
                    <CustomPieChart chartTitle={"Application status"} rawChartData={data.applications} keyValue={"count"} description="applications" colorConfig={getApplicationPieChartColorConfig()} />
                    <ApplicationHistoryUI />
                </div>

                <div className="flex w-full mt-5 gap-5">
                    <CustomPieChart chartTitle={"Container status"} rawChartData={{ containers: data.totalContainers }} keyValue={"count"} description="containers" colorConfig={getContainersPieChartColorConfig()} />
                    <ContainerHistoryUI />
                </div>
            </div>
        )
    } catch (error) {
        return <div className="h-screen w-full flex items-center justify-center">
            Error getting data from YuniKorn API Server
        </div>
    }
}
