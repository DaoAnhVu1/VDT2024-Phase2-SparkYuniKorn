"use client";

import { useState, useEffect } from "react";

import PartitionManagement from "./partition-management";
import RecursiveQueue from "./recursive-queue";
import EditPartitionModal from "@/components/modals/edit-partition-modal";
import EditQueueModal from "@/components/modals/edit-queue-modal";

interface ManageQueueProps {
    configMapObject: any
}

export default function ManageQueue({ configMapObject }: ManageQueueProps) {
    const [selectedPartition, setSelectedPartition] = useState<any>(null);
    const [selectedQueues, setSelectedQueues] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleSetPartition(value: any) {
        setSelectedPartition(value);
        if (value) {
            setSelectedQueues(value.queues);
        } else {
            setSelectedQueues(null);
        }
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
                Manage Queues
            </h1>
            <PartitionManagement
                setPartition={handleSetPartition}
                selectedPartition={selectedPartition}
                partitions={configMapObject?.partitions}
            />
            <div className="mt-5">
                {selectedQueues ? (
                    <div className="flex gap-3">
                        <RecursiveQueue root={selectedQueues} partitionName={selectedPartition.name} level={0} />
                        <EditPartitionModal />
                        <EditQueueModal />
                    </div>
                ) : (
                    <div className="h-full w-full flex justify-center items-center">
                        Please select a partition to continue
                    </div>
                )}
            </div>
        </div>
    );
}
