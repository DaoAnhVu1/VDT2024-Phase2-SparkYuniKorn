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

    public async createConfigMap(namespace: string, configMapName: string, data: any): Promise<V1ConfigMap> {
        let originalConfigMap: V1ConfigMap | null = null;

        try {
            originalConfigMap = await this.getConfigMap(namespace, configMapName);
            if (originalConfigMap) {
                await this.coreApi.deleteNamespacedConfigMap(configMapName, namespace);
            }

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

        } catch (error) {
            console.error(`Error creating ConfigMap ${configMapName} in namespace ${namespace}:`, error);
            if (originalConfigMap) {
                console.warn(`Recreating the original ConfigMap ${configMapName} due to error.`);
                try {
                    const recreateConfigMap: V1ConfigMap = {
                        apiVersion: 'v1',
                        kind: 'ConfigMap',
                        metadata: {
                            name: configMapName,
                            namespace: namespace
                        },
                        data: originalConfigMap.data
                    };
                    await this.coreApi.createNamespacedConfigMap(namespace, recreateConfigMap);
                } catch (recreateError) {
                    console.error(`Failed to recreate the original ConfigMap ${configMapName}:`, recreateError);
                }
            }
            throw error;
        }
    }
}

export default K8sClient;
