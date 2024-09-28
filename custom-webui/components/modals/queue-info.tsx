import { useModal } from '@/hooks/useModal';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

export default function QueueInfoSheet() {
    const { data, isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === "queue-info";

    const handleClose = () => {
        onClose();
    };

    if (!data) {
        return <></>;
    }

    const formatMemory = (memory: any) => memory ? `${(memory / (1024 * 1024)).toFixed(2)} MB` : "n/a";
    const formatVcore = (vcore: any) => vcore ? `${(vcore / 1000).toFixed(2)}` : "n/a";

    return (
        <Sheet open={isModalOpen} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Queue Capacity Information</SheetTitle>
                    <div className="flex flex-col pt-5">
                        {/* Queue Name */}
                        <div className='flex w-full'>
                            <div className='w-1/2'>Name:</div>
                            <div className='w-full'>{data.queuename}</div>
                        </div>

                        {/* Queue Status */}
                        <div className='flex w-full'>
                            <div className='w-1/2'>Status:</div>
                            <div className='w-full'>{data.status}</div>
                        </div>

                        {/* Allocated Resources */}
                        <div className="flex w-full">
                            <div className="w-1/2">Allocated:</div>
                            <div className="w-full">
                                memory: {formatMemory(data.allocatedResource?.memory)}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-full">
                                vcore: {formatVcore(data.allocatedResource?.vcore)}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-full">
                                pods: {data.allocatedResource?.pods ?? "n/a"}
                            </div>
                        </div>

                        {/* Pending Resources */}
                        <div className="flex w-full">
                            <div className="w-1/2">Pending:</div>
                            <div className="w-full">
                                memory: {formatMemory(data.pendingResource?.memory)}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-full">
                                vcore: {formatVcore(data.pendingResource?.vcore)}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-full">
                                pods: {data.pendingResource?.pods ?? "n/a"}
                            </div>
                        </div>

                        {/* Guaranteed Resources */}
                        <div className="flex w-full">
                            <div className="w-1/2">Guaranteed:</div>
                            <div className="w-full">
                                memory: {formatMemory(data.guaranteedResource?.memory)}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-full">
                                vcore: {formatVcore(data.guaranteedResource?.vcore)}
                            </div>
                        </div>

                        {/* Max Resources */}
                        <div className="flex w-full">
                            <div className="w-1/2">Max:</div>
                            <div className="w-full">
                                memory: {formatMemory(data.maxResource?.memory)}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-full">
                                vcore: {formatVcore(data.maxResource?.vcore)}
                            </div>
                        </div>
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
