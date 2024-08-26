"use client";

import { useState } from "react";
import { CirclePlus, CircleMinus, Pencil } from "lucide-react";

interface RecursiveQueueProps {
    root?: any[];
}

const RecursiveQueue = ({ root }: RecursiveQueueProps) => {
    const [selectedQueue, setSelectedQueue] = useState<any>(null);

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
                        className="h-10 w-72 rounded-sm bg-[#e7e7e7] cursor-pointer px-3 flex items-center justify-between"
                    >
                        <p>{node.name}</p>
                        <div className="flex items-center gap-2">
                            <Pencil className="h-5" />
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
                <RecursiveQueue root={selectedQueue.queues} />
            )}
        </>
    );
};

export default RecursiveQueue;
