import K8sClient from "@/utils/k8sClient";
import { V1ConfigMap } from "@kubernetes/client-node";
import { NextResponse, NextRequest } from "next/server";
import YAML from "yaml";

interface QueueConfig {
    name: string;
    maxapplications?: number;
    submitacl?: string;
    adminacl?: string;
    resources?: {
        guaranteed?: {
            vcore?: string;
            memory?: string;
        };
        max?: {
            vcore?: string;
            memory?: string;
        };
    };
    properties?: {
        applicationSortPolicy: string;
        applicationSortPriority: string;
        priorityPolicy: string;
        priorityOffset: number;
        preemptionPolicy: string;
        preemptionDelay: number;
    };
    queues?: QueueConfig[];
}
export async function PATCH(req: Request) {
    try {
        const { queueInfo, partitionName, level, oldName } = await req.json();
        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) throw new Error("ConfigMap or its data is null");

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partition = configMapObject.partitions.find((p: any) => p.name === partitionName);
        if (!partition) throw new Error(`Partition '${partitionName}' not found`);

        let queue = findQueue(partition.queues, oldName);
        if (!queue) throw new Error(`Queue '${oldName}' not found`);
        updateQueueConfig(queue, queueInfo, level);

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

export async function POST(req: Request) {
    try {
        const { parentName, name, maxapplications } = await req.json();

        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) throw new Error("ConfigMap or its data is null");

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partition = configMapObject.partitions.find((p: any) => p.name === "default");
        if (!partition) throw new Error("Default partition not found");

        let parentQueue = findQueue(partition.queues, parentName);
        if (!parentQueue) throw new Error(`Parent queue '${parentName}' not found`);

        createChildQueueConfig(parentQueue, name, maxapplications);

        const updatedConfigMapData = YAML.stringify(configMapObject);
        console.log("Updated ConfigMap Data:", updatedConfigMapData);

        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().updateConfigMap("yunikorn", "yunikorn-configs", configMap.data);

        console.log("Queue successfully created.");
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error("Error creating queue:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const queueName = searchParams.get("name");
        const partitionName = searchParams.get("partitionName");

        if (!queueName || !partitionName) return new NextResponse("Invalid parameters", { status: 400 });

        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) throw new Error("ConfigMap or its data is null");

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        const partition = configMapObject.partitions.find((p: any) => p.name === partitionName);
        if (!partition) return new NextResponse(`Partition '${partitionName}' not found`, { status: 404 });

        deleteQueueFromPartition(partition, queueName);

        const updatedConfigMapData = YAML.stringify(configMapObject);
        console.log("Updated ConfigMap Data:", updatedConfigMapData);

        configMap.data["queues.yaml"] = updatedConfigMapData;
        await K8sClient.getInstance().updateConfigMap("yunikorn", "yunikorn-configs", configMap.data);

        console.log("Queue successfully deleted.");
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error("Error deleting queue:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

function deleteQueueFromPartition(partition: any, queueName: string) {
    if (!partition.queues) return false;

    partition.queues = partition.queues.filter((queue: any) => {
        if (queue.name === queueName) return false;
        if (queue.queues) deleteQueueFromPartition(queue, queueName);
        return true;
    });
}

function findQueue(queues: QueueConfig[] = [], queueName: string): QueueConfig | null {
    for (const queue of queues) {
        if (queue.name === queueName) return queue;
        if (queue.queues) {
            const found = findQueue(queue.queues, queueName);
            if (found) return found;
        }
    }
    return null;
}

function createChildQueueConfig(parentQueue: QueueConfig, childName: string, maxApplications?: number) {
    const newChildQueue: QueueConfig = { name: childName, maxapplications: maxApplications };

    if (newChildQueue.maxapplications == 0) delete newChildQueue.maxapplications;

    if (!parentQueue.queues) parentQueue.queues = [];
    parentQueue.queues.push(newChildQueue);
}

function updateQueueConfig(queue: any, queueInfo: QueueConfig, level: number): void {

    if (queueInfo.name) queue.name = queueInfo.name.trim();

    if (queueInfo.maxapplications) queue.maxapplications = queueInfo.maxapplications;
    else delete queue.maxapplications;

    if (queueInfo.submitacl) queue.submitacl = queueInfo.submitacl.trim();
    else delete queue.submitacl;

    if (queueInfo.adminacl) queue.adminacl = queueInfo.adminacl.trim();
    else delete queue.adminacl;

    queue.resources = queue.resources || {};

    if (queueInfo.resources?.guaranteed) {
        const guaranteed = queueInfo.resources.guaranteed;
        queue.resources.guaranteed = queue.resources.guaranteed || {};

        if (guaranteed.memory && guaranteed.memory.trim() !== "" && guaranteed.memory.trim() !== "0") {
            queue.resources.guaranteed.memory = guaranteed.memory.trim();
        } else {
            delete queue.resources.guaranteed.memory;
        }

        if (guaranteed.vcore && guaranteed.vcore.trim() !== "" && guaranteed.vcore.trim() !== "0") {
            queue.resources.guaranteed.vcore = guaranteed.vcore;
        } else {
            delete queue.resources.guaranteed.vcore;
        }
        if (Object.keys(queue.resources.guaranteed).length === 0) {
            delete queue.resources.guaranteed;
        }
    } else {
        delete queue.resources.guaranteed;
    }

    if (queueInfo.resources?.max) {
        const max = queueInfo.resources.max;
        queue.resources.max = queue.resources.max || {};

        if (max.memory && max.memory.trim() !== "" && max.memory.trim() !== "0") {
            queue.resources.max.memory = max.memory.trim();
        } else {
            delete queue.resources.max.memory;
        }

        if (max.vcore && max.vcore.trim() !== "" && max.vcore.trim() !== "0") {
            queue.resources.max.vcore = max.vcore;
        } else {
            delete queue.resources.max.vcore;
        }

        if (Object.keys(queue.resources.max).length === 0) {
            delete queue.resources.max;
        }
    } else {
        delete queue.resources.max;
    }

    if (Object.keys(queue.resources).length === 0) {
        delete queue.resources;
    }


    if (!queue.properties) {
        queue.properties = {};
    }

    if (queueInfo?.properties) {
        if (queueInfo.properties.applicationSortPolicy) {
            queue.properties["application.sort.policy"] = queueInfo.properties.applicationSortPolicy;
        }

        if (queueInfo.properties.applicationSortPriority) {
            queue.properties["application.sort.priority"] = queueInfo.properties.applicationSortPriority
        }

        if (queueInfo.properties.priorityPolicy) {
            queue.properties["priority.offset"] = String(queueInfo.properties.priorityOffset)
        }

        if (queueInfo.properties.priorityPolicy) {
            queue.properties["priority.policy"] = queueInfo.properties.priorityPolicy
        }

        if (queueInfo.properties.preemptionDelay) {
            queue.properties["preemption.delay"] = queueInfo.properties.preemptionDelay
        }

        if (queueInfo.properties.preemptionPolicy) {
            queue.properties["preemption.policy"] = queueInfo.properties.preemptionPolicy
        }
    } else {
        delete queue.properties;
    }

    if (level === 0) {
        delete queue.resources?.guaranteed;
        delete queue.resources?.max;
    }

    console.log("AFTER", queue)
}