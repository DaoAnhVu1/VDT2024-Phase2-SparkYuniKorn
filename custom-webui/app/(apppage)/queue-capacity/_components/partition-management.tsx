"use client";

import React, { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface PartitionManagementProps {
    setPartition: React.Dispatch<React.SetStateAction<any>>;
    partitions: Array<{ name: string }>;
    selectedPartition: { name: string } | null;
}

export default function PartitionManagement2({
    setPartition,
    selectedPartition,
    partitions,
}: PartitionManagementProps) {
    const searchParams = useSearchParams();
    const partitionName = searchParams.get("partitionName");
    const router = useRouter();

    // Use useEffect to handle state updates based on URL parameters
    useEffect(() => {
        if (partitionName) {
            const matchedPartition = partitions.find(
                (p) => p.name === partitionName
            );

            if (matchedPartition && selectedPartition?.name !== matchedPartition.name) {
                setPartition(matchedPartition);
            }
        }
    }, [partitionName, partitions, selectedPartition, setPartition]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
                <p>Partitions: </p>
                <Select
                    value={selectedPartition?.name || ""}
                    onValueChange={(value) => {
                        const partition = partitions.find((p) => p.name === value);
                        if (partition) {
                            setPartition(partition);
                            router.push(`?partitionName=${partition.name}`);
                        }
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="--SELECT--" />
                    </SelectTrigger>
                    <SelectContent>
                        {partitions &&
                            partitions.map((partition) => (
                                <SelectItem key={partition.name} value={partition.name}>
                                    {partition.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
