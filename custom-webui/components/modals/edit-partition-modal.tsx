import { useModal } from '@/hooks/useModal'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import EditPartitionForm from '@/components/forms/edit-partition-form';

export default function EditPartitionModal() {
    const { data, isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type == "editPartition";

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
                    <DialogTitle>Partition Info</DialogTitle>
                </DialogHeader>
                <EditPartitionForm data={data} onClose={onClose} />
            </DialogContent>
        </Dialog>
    )
}
