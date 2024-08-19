// KubernetesClient.ts
import { KubeConfig, CoreV1Api, V1Pod, V1ConfigMap } from '@kubernetes/client-node';

class KubernetesClient {
  private static instance: KubernetesClient;
  private kubeConfig: KubeConfig;
  private coreV1Api: CoreV1Api;

  private constructor() {
    this.kubeConfig = new KubeConfig();
    this.kubeConfig.loadFromDefault(); // Load kubeconfig from the default location
    this.coreV1Api = this.kubeConfig.makeApiClient(CoreV1Api);
  }

  public static getInstance(): KubernetesClient {
    if (!KubernetesClient.instance) {
      KubernetesClient.instance = new KubernetesClient();
      Object.freeze(KubernetesClient.instance);
    }
    return KubernetesClient.instance;
  }

  public async listPods(namespace: string): Promise<V1Pod[]> {
    try {
      const response = await this.coreV1Api.listNamespacedPod(namespace);
      return response.body.items;
    } catch (error) {
      console.error('Error listing pods:', error);
      throw error;
    }
  }

  public async getConfigMap(namespace: string, name: string): Promise<V1ConfigMap> {
    try {
      const response = await this.coreV1Api.readNamespacedConfigMap(name, namespace);
      return response.body;
    } catch (error) {
      console.error('Error retrieving config map:', error);
      throw error;
    }
  }
}

export default KubernetesClient.getInstance();
