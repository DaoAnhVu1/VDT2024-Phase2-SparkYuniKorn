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
}

export default K8sClient;
