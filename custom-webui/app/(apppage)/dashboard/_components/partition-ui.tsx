"use client"
import { Separator } from "@/components/ui/separator"

interface PartitionUIProps {
    partitionData: any
}

export default function PartitionUI({ partitionData }: PartitionUIProps) {
    return (
        <div className="flex py-3 px-3 justify-between border border-gray-200 shadow-md rounded-md">
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.name}</p>
                <p className="text-xs text-gray-500">Partiton</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.state}</p>
                <p className="text-xs text-gray-500">Status</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.totalNodes}</p>
                <p className="text-xs text-gray-500">Nodes</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.nodeSortingPolicy.type}</p>
                <p className="text-xs text-gray-500">NodeSortingPolicy</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.applications.total}</p>
                <p className="text-xs text-gray-500">Applications</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.totalContainers || "0"}</p>
                <p className="text-xs text-gray-500">Containers</p>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col items-center justify-center w-full">
                <p className="text-lg">{partitionData.name}</p>
                <p className="text-xs text-gray-500">Partiton</p>
            </div>
        </div>
    )
}
