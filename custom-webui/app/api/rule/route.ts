import { V1ConfigMap } from "@kubernetes/client-node";
import { NextResponse, NextRequest } from "next/server";
import YAML from "yaml";
import K8sClient from "@/utils/k8sClient";

export async function PATCH(req: Request) {
    try {
        const request = await req.json();

        if (request.filteredData.filter && !request.filteredData.filter.groups && !request.filteredData.filter.users) {
            delete request.filteredData.filter;
        }

        const parentList = request.parentPath.split(".").slice(1);
        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) throw new Error("ConfigMap or its data is null");

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partition = configMapObject.partitions.find((p: any) => p.name === request.partitionName);
        if (!partition) throw new Error(`Partition '${request.partitionName}' not found`);

        let rulesToUpdate: any;

        if (parentList.length === 0) {
            rulesToUpdate = partition.placementrules.find((rule: any) => rule.name === request.originalName);
            if (!rulesToUpdate) throw new Error(`Rule with name '${request.filteredData.name}' not found`);
        } else {
            const firstKey = parentList[0];
            rulesToUpdate = partition.placementrules.find((rule: any) => rule.name === firstKey);
            if (!rulesToUpdate) throw new Error(`Rule with name '${firstKey}' not found`);

            for (let i = 1; i < parentList.length; i++) {
                const key = parentList[i];
                if (rulesToUpdate.parent[key]) {
                    rulesToUpdate = rulesToUpdate.parent[key];
                } else {
                    throw new Error(`Key '${key}' not found in rule '${firstKey}'`);
                }
            }
            rulesToUpdate = rulesToUpdate.parent
        }

        if (request.filteredData.name == "provided" || request.filteredData.name == "user") {
            delete rulesToUpdate.value
        }

        Object.assign(rulesToUpdate, request.filteredData);
        const updatedConfigMapData = YAML.stringify(configMapObject);
        console.log("Updated ConfigMap Data:", updatedConfigMapData);
        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().updateConfigMap("yunikorn", "yunikorn-configs", configMap.data);
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error("Error updating queue:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
