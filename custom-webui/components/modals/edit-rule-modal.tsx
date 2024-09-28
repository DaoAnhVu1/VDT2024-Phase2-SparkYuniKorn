import { useModal } from "@/hooks/useModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import EditRuleForm from "@/components/forms/edit-rule-form";


export default function EditRuleModal() {
    const { data, isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type == "editRule";
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
                    <DialogTitle>Rule Info</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <EditRuleForm onClose={handleClose} ruleInfo={data.ruleInfo} partitionName={data.partitionName} level={data.level} parent={data.parent} />
                </DialogContent>
            </DialogContent>
        </Dialog>
    )
}
