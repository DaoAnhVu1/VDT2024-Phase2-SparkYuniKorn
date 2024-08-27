import K8sClient from "@/utils/k8sClient";
import { V1ConfigMap } from "@kubernetes/client-node";
import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
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
    maxapplications?: number;
    submitacl?: string;
    adminacl?: string;
    resources?: QueueResources;
    queues?: QueueConfig[];
}

interface QueueInfo {
    name: string;
    maxapplications: number;
    submitacl: string;
    adminacl: string;
    resources?: QueueResources;
}

export async function PATCH(req: Request) {
    try {
        const { queueInfo, partitionName, level, oldName } = await req.json();

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

        console.log("Updated ConfigMap Data:", updatedConfigMapData);
        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().createConfigMap("yunikorn", "yunikorn-configs", configMap.data);

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { parentName, name, maxapplications } = await req.json();

        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) {
            throw new Error("ConfigMap or its data is null");
        }

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partition = configMapObject.partitions.find((p: any) => p.name === "default"); // Assuming default partition
        if (!partition) {
            throw new Error("Default partition not found");
        }

        let parentQueue = findQueue(partition.queues, parentName);
        if (!parentQueue) {
            throw new Error(`Parent queue '${parentName}' not found`);
        }

        createChildQueueConfig(parentQueue, name, maxapplications);

        const updatedConfigMapData = YAML.stringify(configMapObject);

        console.log("Updated ConfigMap Data:", updatedConfigMapData);
        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().createConfigMap("yunikorn", "yunikorn-configs", configMap.data);

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const queueName = searchParams.get("name");
        const partitionName = searchParams.get("partitionName");

        if (!queueName || !partitionName) {
            return new NextResponse("Invalid parameters", { status: 400 });
        }

        // Fetch the existing ConfigMap
        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) {
            throw new Error("ConfigMap or its data is null");
        }

        // Parse the YAML data from the ConfigMap
        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        // Find the partition to update
        const partition = configMapObject.partitions.find((p: any) => p.name === partitionName);
        if (!partition) {
            return new NextResponse(`Partition '${partitionName}' not found`, { status: 404 });
        }

        // Remove the queue from the partition
        deleteQueueFromPartition(partition, queueName);
        // Convert the updated object back to YAML format
        const updatedConfigMapData = YAML.stringify(configMapObject);
        console.log(updatedConfigMapData)
        // Update the ConfigMap in Kubernetes
        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().createConfigMap("yunikorn", "yunikorn-configs", configMap.data);

        // Return a successful response
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new NextResponse("Internal Error", { status: 500 });
    }
}

function deleteQueueFromPartition(partition: any, queueName: string) {
    if (!partition.queues) {
        return false;
    }

    const initialLength = partition.queues.length;
    partition.queues = partition.queues.filter((queue: any) => {
        if (queue.name === queueName) {
            return false;
        }
        if (queue.queues) {
            deleteQueueFromPartition(queue, queueName);
        }
        return true;
    });
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


function createChildQueueConfig(parentQueue: QueueConfig, childName: string, maxApplications?: number) {
    const newChildQueue: QueueConfig = {
        name: childName,
        maxapplications: maxApplications
    };

    if (newChildQueue.maxapplications == 0) {
        delete newChildQueue.maxapplications
    }

    if (!parentQueue.queues) {
        parentQueue.queues = [];
    }
    parentQueue.queues.push(newChildQueue);
}

function updateQueueConfig(queue: QueueConfig, queueInfo: QueueInfo, level: number): void {
    if (queueInfo.name !== undefined && queueInfo.name.trim() !== "") {
        queue.name = queueInfo.name;
    }

    if (queueInfo.maxapplications !== undefined && queueInfo.maxapplications !== 0) {
        queue.maxapplications = queueInfo.maxapplications;
    } else {
        delete queue.maxapplications;
    }

    if (queueInfo.submitacl !== undefined && queueInfo.submitacl.trim() !== "") {
        queue.submitacl = queueInfo.submitacl;
    } else {
        delete queue.submitacl;
    }

    if (queueInfo.adminacl !== undefined && queueInfo.adminacl.trim() !== "") {
        queue.adminacl = queueInfo.adminacl;
    } else {
        delete queue.adminacl;
    }

    queue.resources = queue.resources || {};

    if (queueInfo.resources?.guaranteed) {
        const guaranteed = queueInfo.resources.guaranteed;
        queue.resources.guaranteed = queue.resources.guaranteed || {};

        if (guaranteed.memory !== undefined && guaranteed.memory.trim() !== "") {
            queue.resources.guaranteed.memory = guaranteed.memory;
        } else {
            delete queue.resources.guaranteed.memory;
        }

        if (guaranteed.vcore !== undefined && guaranteed.vcore !== 0) {
            queue.resources.guaranteed.vcore = guaranteed.vcore;
        } else {
            delete queue.resources.guaranteed.vcore;
        }
    } else {
        delete queue.resources.guaranteed;
    }

    if (queueInfo.resources?.max) {
        const max = queueInfo.resources.max;
        queue.resources.max = queue.resources.max || {};

        if (max.memory !== undefined && max.memory.trim() !== "") {
            queue.resources.max.memory = max.memory;
        } else {
            delete queue.resources.max.memory;
        }

        if (max.vcore !== undefined && max.vcore !== 0) {
            queue.resources.max.vcore = max.vcore;
        } else {
            delete queue.resources.max.vcore;
        }
    } else {
        delete queue.resources.max;
    }

    if (level === 0) {
        delete queue.resources?.guaranteed;
        delete queue.resources?.max;
    }
}