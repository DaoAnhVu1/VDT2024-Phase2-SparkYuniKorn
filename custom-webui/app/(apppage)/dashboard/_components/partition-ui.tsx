"use client"
import { Separator } from "@/components/ui/separator"

interface PartitionUIProps {
    partitionData: {
        name?: string
        state?: string
        totalNodes?: number
        nodeSortingPolicy?: {
            type?: string
        }
        applications?: {
            total?: number
        }
        totalContainers?: number
    }
}

export default function PartitionUI({ partitionData }: PartitionUIProps) {
    return (
        <div className="flex py-3 px-3 justify-between border border-gray-200 shadow-md rounded-md">
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.name || "Null"}</p>
                <p className="text-xs text-gray-500">Partition</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.state || "Null"}</p>
                <p className="text-xs text-gray-500">Status</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.totalNodes !== undefined ? partitionData.totalNodes : "Null"}</p>
                <p className="text-xs text-gray-500">Nodes</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.nodeSortingPolicy?.type || "Null"}</p>
                <p className="text-xs text-gray-500">NodeSortingPolicy</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.applications?.total !== undefined ? partitionData.applications.total : "Null"}</p>
                <p className="text-xs text-gray-500">Applications</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.totalContainers !== undefined ? partitionData.totalContainers : "Null"}</p>
                <p className="text-xs text-gray-500">Containers</p>
            </div>
        </div>
    )
}
