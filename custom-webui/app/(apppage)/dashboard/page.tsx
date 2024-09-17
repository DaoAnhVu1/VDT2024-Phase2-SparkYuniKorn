import axios from "axios"
import { env } from "process"
import PartitionUI from "./_components/partition-ui"
import { CustomPieChart } from "@/components/charts/pie-chart"
import ApplicationHistoryUI from "./_components/application-history-ui"
import { getApplicationPieChartColorConfig } from "@/utils/chartColorConfig"

export default async function DashboardPage() {

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
        </div>
    )
}
