"use client"

import { useState } from "react";
import PartitionManagement from "./partition-manangement";
import QueueSelection from "./queue-selection";
import QueueJob from "./queueJob";

interface ApplicationUIProps {
    configMapObject: any
}

export default function ApplicationUI({ configMapObject }: ApplicationUIProps) {
    const [selectedPartition, setSelectedPartition] = useState<any>(null);

    const [selectedQueue, setSelectedQueue] = useState<any>(null);

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
                Applications
            </h1>

            <div className="flex gap-5">
                <PartitionManagement setPartition={handleSetPartition}
                    selectedPartition={selectedPartition}
                    partitions={configMapObject?.partitions} />
                {selectedPartition && (
                    <QueueSelection selectedQueue={selectedQueue} queueLists={selectedPartition.queues} setQueue={setSelectedQueue} />
                )}
            </div>


            <div className="mt-5">
                {!selectedQueue ? (
                    <div className="text-center">
                        Select a queue to view applications
                    </div>
                ) : (
                    <div>
                        <QueueJob partition={selectedPartition.name} queue={selectedQueue} />
                    </div>
                )}
            </div>

        </div>
    )
}
