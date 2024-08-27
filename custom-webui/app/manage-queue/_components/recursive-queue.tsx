"use client";

import { useState } from "react";
import { CirclePlus, CircleMinus, Pencil } from "lucide-react";
import { useModal } from "@/hooks/useModal";

interface RecursiveQueueProps {
    root?: any[];
    partitionName: any;
    level: number;
}

const RecursiveQueue = ({ root, partitionName, level }: RecursiveQueueProps) => {
    const [selectedQueue, setSelectedQueue] = useState<any>(null);
    const { onOpen } = useModal()
    if (root == null) {
        return null;
    }

    const handleNodeClick = (node: any) => {
        if (selectedQueue === node) {
            setSelectedQueue(null);
        } else {
            setSelectedQueue(node);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {root?.map((node: any) => (
                    <div
                        key={node.name}
                        className="h-10 w-64 rounded-sm bg-[#e7e7e7] cursor-pointer px-3 flex items-center justify-between"
                    >
                        <p>{node.name}</p>
                        <div className="flex items-center gap-2">
                            <Pencil className="h-5" onClick={() => {
                                onOpen("editQueue", { queueInfo: node, partitionName, level })
                            }} />
                            {node.queues && (
                                selectedQueue === node ? (
                                    <CircleMinus
                                        className="h-5 cursor-pointer"
                                        onClick={() => handleNodeClick(node)}
                                    />
                                ) : (
                                    <CirclePlus
                                        className="h-5 cursor-pointer"
                                        onClick={() => handleNodeClick(node)}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {selectedQueue && (
                <RecursiveQueue root={selectedQueue.queues} partitionName={partitionName} level={level + 1} />
            )}
        </>
    );
};

export default RecursiveQueue;
