"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";


interface PartitionManagementProps {
    setPartition: any;
    partitions: any;
    selectedPartition: any;
}

export default function PartitionManagement({ setPartition, selectedPartition, partitions }: PartitionManagementProps) {
    const { onOpen } = useModal()
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
                <p>Partitions: </p>
                <Select onValueChange={(e) => {
                    setPartition(e)
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="--SELECT--" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            partitions && partitions.map((partition: any) => {
                                return (
                                    <SelectItem key={partition.name} value={partition}>
                                        {partition.name}
                                    </SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
            </div>
            {
                selectedPartition && (
                    <Button onClick={() => {
                        onOpen("editPartition", selectedPartition)
                    }}>
                        Edit
                    </Button>
                )
            }
        </div>
    )
}
