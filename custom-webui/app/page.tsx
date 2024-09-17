import K8sClient from "@/utils/k8sClient";
import { V1ConfigMap } from "@kubernetes/client-node";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  try {
    const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
    if (!configMap || !configMap.data) {
      throw new Error("ConfigMap or its data is null");
    }
  } catch (error) {
    return <div className="h-screen w-full flex items-center justify-center">
      Error getting the queue config, please check your cluster.
    </div>
  }
  redirect("/info")
}
