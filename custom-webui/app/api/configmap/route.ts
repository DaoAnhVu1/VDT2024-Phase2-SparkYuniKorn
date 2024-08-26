import K8sClient from "@/utils/k8sClient"
import { V1ConfigMap } from "@kubernetes/client-node";
import { NextResponse } from "next/server"
import YAML from "yaml"

export async function GET(req: Request) {
    try {
        const configMap: V1ConfigMap | null = await K8sClient.getInstance().getConfigMap("yunikorn", "yunikorn-configs");
        if (!configMap || !configMap.data) {
            throw new Error("ConfigMap or its data is null");
        }

        const configMapData = configMap.data["queues.yaml"];
        const configMapObject = YAML.parse(configMapData);
        return NextResponse.json({...configMapObject}, { status: 200 })
    } catch (error) {
        console.error("[CONFIGMAP]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}