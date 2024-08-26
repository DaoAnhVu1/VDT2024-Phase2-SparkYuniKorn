import K8sClient from '@/utils/k8sClient'
import { V1ConfigMap } from '@kubernetes/client-node';
import YAML from "yaml"
import ManageQueue from './_components/manage-queue';

export default async function ManageQueuePage() {
    const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
    if (!configMap || !configMap.data) {
        throw new Error("ConfigMap or its data is null");
    }

    const configMapData = configMap.data["queues.yaml"];
    const configMapObject = YAML.parse(configMapData);
    return (
        <ManageQueue configMapObject={configMapObject} />
    )
}
