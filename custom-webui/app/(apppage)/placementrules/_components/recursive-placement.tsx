"use client";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { CirclePlus, CircleMinus, Pencil } from "lucide-react";

interface RecursivePlacementProps {
  rules?: any[]; // Expecting an array of rules
  partitionName: any;
  level: number;
  parent: string
}

export default function RecursivePlacement({ rules, partitionName, level, parent }: RecursivePlacementProps) {
  const [selectedRules, setSelectedRules] = useState<any>(null);
  const { onOpen } = useModal();
  const processedRules = Array.isArray(rules) ? rules : rules ? [rules] : [];

  if (processedRules.length === 0) {
    return null;
  }

  const handleNodeClick = (node: any) => {
    setSelectedRules(selectedRules === node ? null : node);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {processedRules.map((node: any) => (
          <div
            key={node.name}
            className="h-10 w-64 rounded-sm bg-[#e7e7e7] cursor-pointer px-3 flex items-center justify-between"
          >
            <p>{node.name}</p>
            <div className="flex items-center gap-2">
              <Pencil className="h-5" onClick={() => {
                onOpen("editRule", { ruleInfo: node, partitionName, level, parent })
              }} />
              {node.parent && (
                selectedRules === node ? (
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
      {selectedRules && (
        <RecursivePlacement rules={selectedRules.parent} partitionName={partitionName} level={level + 1} parent={parent + "." + selectedRules.name} />
      )}
    </>
  );
}
