import K8sClient from "@/utils/k8sClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const namespacePod = searchParams.get("namespacePod");

        // Check if namespacePod is provided
        if (!namespacePod) {
            return new NextResponse("Missing namespacePod parameter", { status: 400 });
        }

        const [namespace, pod] = namespacePod.split("/");

        // Using K8sClient to get logs from the specified pod in the namespace
        const logs = await K8sClient.getInstance().getPodLogs(namespace, pod);
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error getting logs: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
