import K8sClient from "@/utils/k8sClient";
import { V1ConfigMap } from "@kubernetes/client-node";
import { NextResponse } from "next/server";
import YAML from "yaml";

export async function PATCH(req: Request) {
    try {
        const { currentName, newConfig } = await req.json();
        console.log(newConfig);

        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) {
            throw new Error("ConfigMap or its data is null");
        }

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partitionIndex = configMapObject.partitions.findIndex((p: any) => p.name === currentName);

        if (partitionIndex === -1) {
            throw new Error(`Partition with name "${currentName}" not found.`);
        }

        // Ensure the properties exist before trying to set them
        const partition = configMapObject.partitions[partitionIndex];
        if (!partition.nodesortpolicy) {
            partition.nodesortpolicy = {};
        }
        if (!partition.preemption) {
            partition.preemption = {};
        }

        // Update the properties
        partition.name = newConfig.name;
        partition.nodesortpolicy.type = newConfig.nodesortpolicy;
        partition.preemption.enabled = newConfig.preemption;

        const updatedYaml = YAML.stringify(configMapObject);

        configMap.data["queues.yaml"] = updatedYaml;
        await K8sClient.getInstance().createConfigMap("yunikorn", "yunikorn-configs", configMap.data);
        return NextResponse.json({ message: "Partition updated successfully" }, { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
