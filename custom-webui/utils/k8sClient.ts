import { KubeConfig, CoreV1Api, V1ConfigMap } from '@kubernetes/client-node';

class K8sClient {
    private static instance: K8sClient;
    private kubeConfig: KubeConfig;
    private coreApi: CoreV1Api;

    private constructor() {
        this.kubeConfig = new KubeConfig();
        this.kubeConfig.loadFromDefault();

        this.coreApi = this.kubeConfig.makeApiClient(CoreV1Api);
    }

    public static getInstance(): K8sClient {
        if (!K8sClient.instance) {
            K8sClient.instance = new K8sClient();
        }
        return K8sClient.instance;
    }

    public async getConfigMap(namespace: string, configMapName: string): Promise<V1ConfigMap> {
        try {
            const response = await this.coreApi.readNamespacedConfigMap(configMapName, namespace);
            return response.body;
        } catch (error) {
            console.error(`Error getting ConfigMap ${configMapName} in namespace ${namespace}:`, error);
            throw error;
        }
    }

    public async updateConfigMap(namespace: string, configMapName: string, data: any): Promise<V1ConfigMap> {
        try {
            // Fetch the existing ConfigMap
            const originalConfigMap = await this.getConfigMap(namespace, configMapName);

            // If the ConfigMap does not exist, create a new one
            if (!originalConfigMap) {
                const newConfigMap: V1ConfigMap = {
                    apiVersion: 'v1',
                    kind: 'ConfigMap',
                    metadata: {
                        name: configMapName,
                        namespace: namespace
                    },
                    data
                };

                const response = await this.coreApi.createNamespacedConfigMap(namespace, newConfigMap);
                return response.body;
            }

            // Update the existing ConfigMap with new data
            const updatedConfigMap: V1ConfigMap = {
                apiVersion: 'v1',
                kind: 'ConfigMap',
                metadata: {
                    name: configMapName,
                    namespace: namespace
                },
                data
            };

            const response = await this.coreApi.replaceNamespacedConfigMap(configMapName, namespace, updatedConfigMap);
            return response.body;

        } catch (error) {
            console.error(`Error updating ConfigMap ${configMapName} in namespace ${namespace}:`, error);
            throw error;
        }
    }

    public async getPodLogs(namespace: string, podName: string) {
        try {
            const response = await this.coreApi.readNamespacedPodLog(podName, namespace);
            return response.body;
        } catch (error) {
            console.error(`Error getting logs for pod ${podName} in namespace ${namespace}:`, error);
            throw error;
        }
    }

}

export default K8sClient;
