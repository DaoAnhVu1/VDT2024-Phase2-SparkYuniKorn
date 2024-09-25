import K8sClient from '@/utils/k8sClient'
import { V1ConfigMap } from '@kubernetes/client-node';
import YAML from "yaml"
import ManagePlacementRules from './_components/manage-placementrules';

export default async function ManageQueuePage() {
    try {
        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) {
            throw new Error("ConfigMap or its data is null");
        }
        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);

        return (
            <ManagePlacementRules configMapObject={configMapObject} />
        )
    } catch (error) {
        return <div className="h-screen w-full flex items-center justify-center">
            Error getting the queue config, please check your cluster.
        </div>
    }
}
