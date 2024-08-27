import { useModal } from '@/hooks/useModal'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import CreateChildForm from '@/components/forms/create-child-form';

export default function CreateChildModal() {
    const { data, isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type == "createChild";

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
                    <DialogTitle className='px-3'>Create a child of {data.parentName}</DialogTitle>
                </DialogHeader>
                <CreateChildForm parentName={data.parentName} parentmaxapplications={data.maxapplications} />
            </DialogContent>
        </Dialog>
    )
}
