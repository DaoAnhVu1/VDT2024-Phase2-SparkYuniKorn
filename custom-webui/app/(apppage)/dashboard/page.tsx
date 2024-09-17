import axios from "axios"
import { env } from "process"
import PartitionUI from "./_components/partition-ui"
import { CustomPieChart } from "./_components/pie-chart"
import { getApplicationPieChartColorConfig } from "@/utils/chartColorConfig"

export default async function DashboardPage() {

    const response = [{ "clusterId": "mycluster", "name": "default", "capacity": { "capacity": { "ephemeral-storage": 62671097856, "hugepages-1Gi": 0, "hugepages-2Mi": 0, "hugepages-32Mi": 0, "hugepages-64Ki": 0, "memory": 6217396224, "pods": 110, "vcore": 5000 }, "usedCapacity": { "memory": 1879048192, "pods": 2, "vcore": 2000 }, "utilization": { "memory": 30, "pods": 1, "vcore": 40 } }, "nodeSortingPolicy": { "type": "fair", "resourceWeights": { "memory": 1, "vcore": 1 } }, "totalNodes": 1, "applications": { "Failed": 1, "Running": 1, "total": 2 }, "totalContainers": 2, "state": "Active", "lastStateTransitionTime": 1726534786434182422 }]
    const data = response[0]
    return (
        <div className="p-5 flex flex-col min-h-screen h-screen">
            <h1 className="text-2xl font-semibold mb-5 flex justify-center items-center h-20">
                Dashboard
            </h1>

            <PartitionUI partitionData={data} />

            <div className="flex w-full mt-5">
                <CustomPieChart chartTitle={"Application status"} rawChartData={data.applications} keyValue={"count"} description="applications" colorConfig={getApplicationPieChartColorConfig()} />
            </div>
        </div>
    )
}
