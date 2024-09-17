import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useRouter, useSearchParams } from "next/navigation";

interface PartitionManagementProps {
    setPartition: any;
    partitions: any;
    selectedPartition: any;
}

export default function PartitionManagement({ setPartition, selectedPartition, partitions }: PartitionManagementProps) {
    const { onOpen } = useModal();
    const searchParams = useSearchParams();
    const partitionName = searchParams.get("partitionName");
    const router = useRouter()

    // If searchParams contains partitionName, find the corresponding partition
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
            {selectedPartition && (
                <Button onClick={() => onOpen("editPartition", selectedPartition)}>
                    Edit
                </Button>
            )}
        </div>
    );
}
