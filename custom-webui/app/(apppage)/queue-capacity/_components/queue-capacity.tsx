"use client"
import { useState } from "react";
import PartitionManagement2 from "./partition-management";
import QueueCapacityFetch from "./queue-capacity-fetch";

interface QueueCapacityProps {
    configMapObject: any;
}

export default function QueueCapacity({ configMapObject }: QueueCapacityProps) {
    const [selectedPartition, setSelectedPartition] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    function handleSetPartition(value: any) {
        setSelectedPartition(value);
    }


    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-5 flex flex-col min-h-screen h-screen">
            <h1 className="text-2xl font-semibold mb-5 flex justify-center items-center h-20">
                Queue Capacity
            </h1>

            <div className="flex gap-5">
                <PartitionManagement2 setPartition={handleSetPartition}
                    selectedPartition={selectedPartition}
                    partitions={configMapObject?.partitions} />

            </div>


            <div className="mt-5">
                {!selectedPartition ? (
                    <div className="text-center">
                        Select a queue to view applications
                    </div>
                ) : (
                    <div>
                        <QueueCapacityFetch partitionName={selectedPartition.name} />
                    </div>
                )}
            </div>

        </div>
    )
}
