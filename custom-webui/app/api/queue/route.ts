import K8sClient from "@/utils/k8sClient";
import { V1ConfigMap } from "@kubernetes/client-node";
import { NextResponse } from "next/server";
import YAML from "yaml";

interface QueueResources {
    guaranteed?: {
        vcore?: number;
        memory?: string;
    };
    max?: {
        vcore?: number;
        memory?: string;
    };
}

interface QueueConfig {
    name: string;
    maxapplications: number;
    submitacl: string;
    adminacl: string;
    resources: QueueResources;
    queues: QueueConfig[];
}

interface QueueInfo {
    name: string;
    maxapplications: number;
    submitacl: string;
    adminacl: string;
    resources: QueueResources;
}

export async function PATCH(req: Request) {
    try {
        const { oldName, queueInfo, partitionName, level } = await req.json();

        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) {
            throw new Error("ConfigMap or its data is null");
        }

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partition = configMapObject.partitions.find((p: any) => p.name === partitionName);
        if (!partition) {
            throw new Error(`Partition '${partitionName}' not found`);
        }

        let queue = findQueue(partition.queues, oldName);
        if (!queue) {
            throw new Error(`Queue '${oldName}' not found`);
        }

        updateQueueConfig(queue, queueInfo, level);

        const updatedConfigMapData = YAML.stringify(configMapObject);
        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().createConfigMap("yunikorn", "yunikorn-configs", configMap.data);

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

function findQueue(queues: QueueConfig[] = [], queueName: string): QueueConfig | null {
    for (const queue of queues) {
        if (queue.name === queueName) {
            return queue;
        }
        if (queue.queues) {
            const found = findQueue(queue.queues, queueName);
            if (found) return found;
        }
    }
    return null;
}

function updateQueueConfig(queue: QueueConfig, queueInfo: QueueInfo, level: number): void {
    if (queueInfo.name?.trim()) {
        queue.name = queueInfo.name;
    }

    if (queueInfo.maxapplications) {
        queue.maxapplications = queueInfo.maxapplications;
    }

    if (queueInfo.submitacl?.trim()) {
        queue.submitacl = queueInfo.submitacl;
    }

    if (queueInfo.adminacl?.trim()) {
        queue.adminacl = queueInfo.adminacl;
    }

    queue.resources = queue.resources || {};

    if (queueInfo.resources?.guaranteed) {
        const guaranteed = queueInfo.resources.guaranteed;
        queue.resources.guaranteed = queue.resources.guaranteed || {};

        if (guaranteed.memory?.trim()) {
            queue.resources.guaranteed.memory = guaranteed.memory;
        }

        if (guaranteed.vcore) {
            queue.resources.guaranteed.vcore = guaranteed.vcore;
        }
    }

    if (queueInfo.resources?.max) {
        const max = queueInfo.resources.max;
        queue.resources.max = queue.resources.max || {};

        if (max.memory?.trim()) {
            queue.resources.max.memory = max.memory;
        }

        if (max.vcore) {
            queue.resources.max.vcore = max.vcore;
        }
    }

    if (level === 0) {
        delete queue.resources.guaranteed;
        delete queue.resources.max;
    }
}
