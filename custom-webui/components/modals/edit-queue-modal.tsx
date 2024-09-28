import { useModal } from "@/hooks/useModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import EditQueueForm from "@/components/forms/edit-queue-form";

export default function EditQueueModal() {
    const { data, isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type == "editQueue";
    const handleClose = () => {
        onClose();
    };

    if (!data) {
        return <></>
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Queue Info</DialogTitle>
                </DialogHeader>
                <EditQueueForm onClose={handleClose} queueInfo={data.queueInfo} partitionName={data.partitionName} level={data.level} />
            </DialogContent>
        </Dialog>
    )
}
