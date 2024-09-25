"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface PartitionManagementProps {
    setPartition: any;
    partitions: any;
    selectedPartition: any;
}

export default function PartitionManagement2({ setPartition, selectedPartition, partitions }: PartitionManagementProps) {
    const searchParams = useSearchParams();
    const partitionName = searchParams.get("partitionName");
    const router = useRouter()

    if (partitionName) {
        const matchedPartition = partitions.find(
            (p: any) => p.name === partitionName
        );

        if (matchedPartition && selectedPartition?.name !== matchedPartition.name) {
            setPartition(matchedPartition);
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
                <p>Partitions: </p>
                <Select
                    value={selectedPartition?.name || ""}
                    onValueChange={(value) => {
                        const partition = partitions.find((p: any) => p.name === value);
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
                        {partitions && partitions.map((partition: any) => (
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
