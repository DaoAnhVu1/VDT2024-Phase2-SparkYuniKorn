import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface QueueSelectionProps {
    setQueue: any;
    queueLists: any;
    selectedQueue: any;
}

// Helper function to process and extract leaf queues
const getLeafQueues = (queues: any, parentName: string = ""): string[] => {
    const leafQueues: string[] = [];

    queues.forEach((queue: any) => {
        const queuePath = parentName ? `${parentName}.${queue.name}` : queue.name;
        if (queue.queues && queue.queues.length > 0) {

            leafQueues.push(...getLeafQueues(queue.queues, queuePath));
        } else {
            // Add leaf queue to the list
            leafQueues.push(queuePath);
        }
    });

    return leafQueues;
};

export default function QueueSelection({ selectedQueue, setQueue, queueLists }: QueueSelectionProps) {
    const leafQueues = getLeafQueues(queueLists);

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
                <p>Queue: </p>
                <Select
                    value={selectedQueue || ""}
                    onValueChange={(value) => {
                        setQueue(value);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="--SELECT--" />
                    </SelectTrigger>
                    <SelectContent>
                        {leafQueues.map((queuePath) => (
                            <SelectItem key={queuePath} value={queuePath}>
                                {queuePath}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
