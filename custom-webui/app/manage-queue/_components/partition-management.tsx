"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface PartitionManagementProps {
    setPartition: any;
    partitions: any
}

export default function PartitionManagement({ setPartition, partitions }: PartitionManagementProps) {
    return (
        <div className="flex items-center gap-3">
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
                                <SelectItem key={partition.name} value={partition.name}>
                                    {partition.name}
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    )
}
