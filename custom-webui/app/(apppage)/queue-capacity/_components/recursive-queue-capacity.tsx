"use client";

import { useModal } from "@/hooks/useModal";
import { CircleMinus, CirclePlus, Info } from "lucide-react";
import { useState } from "react";

interface RecursiveQueueCapacityProps {
    queueList: any[];
}

export default function RecursiveQueueCapacity({ queueList }: RecursiveQueueCapacityProps) {
    const [selectedQueue, setSelectedQueue] = useState<any>(null);
    const { onOpen } = useModal();

    if (queueList.length === 0) {
        return null;
    }

    console.log(queueList);

    const handleNodeClick = (node: any) => {
        setSelectedQueue(selectedQueue === node ? null : node);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {queueList?.map((node: any) => {
                    // Check if maxResource is present, if not set percent to 0
                    let finalPercent = 0;
                    if (node?.maxResource?.memory && node?.maxResource?.vcore) {
                        const allocatedResourceMemory = node?.allocatedResource?.memory || 0;
                        const allocatedResourceVCore = node?.allocatedResource?.vcore || 0;
                        const maxResourceMemory = node.maxResource.memory;
                        const maxResourceVCore = node.maxResource.vcore;

                        // Calculate percentages
                        const memoryPercent = (allocatedResourceMemory / maxResourceMemory) * 100;
                        const vcorePercent = (allocatedResourceVCore / maxResourceVCore) * 100;
                        finalPercent = (memoryPercent + vcorePercent) / 2;
                    }


                    let bgcolor = "";
                    if (finalPercent < 40) bgcolor = "bg-blue-700";
                    else if (finalPercent < 80) bgcolor = "bg-green-700";
                    else bgcolor = "bg-red-700";

                    console.log("Final Percent:", finalPercent, "Background Color:", bgcolor);
                    return (
                        <div
                            key={node.queuename}
                            className="h-10 w-64 rounded-sm bg-[#e7e7e7] cursor-pointer px-3 flex items-center justify-between relative"
                        >
                            {/* Background bar */}
                            <div className="w-full h-1 bg-gray-300 rounded-sm absolute bottom-0 -ml-3"></div>

                            {/* Show the progress bar only if finalPercent is greater than 0 */}
                            {finalPercent > 0 && (
                                <div className={`h-1 ${bgcolor} rounded-sm absolute bottom-0 -ml-3`} style={{ width: `${finalPercent}%` }}></div>
                            )}

                            {/* Text and icons */}
                            <div className="flex w-full justify-between items-center relative z-10">
                                <p>{node.queuename}</p>
                                <div className="flex items-center gap-2">
                                    <Info
                                        className="h-5 cursor-pointer"
                                        onClick={() => {
                                            onOpen("queue-info", { ...node })
                                        }}
                                    />
                                    {!node.isLeaf && node.children.length > 0 && (
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
                        </div>
                    );
                })}
            </div>
            {selectedQueue && (
                <RecursiveQueueCapacity queueList={selectedQueue.children} />
            )}
        </>
    );
}
