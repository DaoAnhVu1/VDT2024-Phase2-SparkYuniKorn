"use client"
import { useState } from "react";
import PartitionManagement2 from "./partition-management";
import RecursivePlacement from "./recursive-placement";
import EditRuleModal from "@/components/modals/edit-rule-modal";

interface ManagePlacementRulesProps {
    configMapObject: any
}


export default function ManagePlacementRules({ configMapObject }: ManagePlacementRulesProps) {
    const [selectedPartition, setSelectedPartition] = useState<any>(null);
    const [placementRules, setPlacementRules] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    function handleSetPartition(value: any) {
        setSelectedPartition(value);
        if (value) {
            setPlacementRules(value.placementrules)
        } else {
            setPlacementRules(null)
        }
    }


    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                Loading...
            </div>
        );
    }
    return (
        <div className="p-5 flex flex-col min-h-screen h-screen">
            <h1 className="text-2xl font-semibold mb-5 flex justify-center items-center h-20">
                Placement Rules
            </h1>
            <PartitionManagement2
                setPartition={handleSetPartition}
                selectedPartition={selectedPartition}
                partitions={configMapObject?.partitions}
            />
            <div className="mt-5">
                {placementRules ? (
                    <div className="flex gap-3">
                        <RecursivePlacement rules={placementRules} level={0} partitionName={selectedPartition.name} parent="" />
                        <EditRuleModal />
                    </div>
                ) : (
                    <div className="h-full w-full flex justify-center items-center">
                        Please select a partition to continue
                    </div>
                )}
            </div>
        </div>
    )
}
