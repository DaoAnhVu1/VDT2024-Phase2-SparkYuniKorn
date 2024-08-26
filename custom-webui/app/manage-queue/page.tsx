"use client";

import { useState, useEffect } from "react";
import K8sClient from "@/utils/k8sClient";
import { V1ConfigMap } from "@kubernetes/client-node";
import YAML from "yaml";
import PartitionManagement from "./_components/partition-management";
import axios from "axios";

export default function ManageQueue() {
    const [configMapObject, setConfigMapObject] = useState<any>(null);
    const [selectedPartition, setSelectedPartition] = useState<string | null>(null);
    const [selectedQueues, setSelectedQueues] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfigMap = async () => {
            setLoading(true); // Start loading
            try {
                let request = await axios.get("/api/configmap");
                let configMap = request.data;
                if (!configMap) {
                    throw new Error("ConfigMap or its data is null");
                }
                const parsedConfigMap = YAML.parse(JSON.stringify(configMap));
                setConfigMapObject(parsedConfigMap);
            } catch (fetchError) {
                console.error("Error fetching ConfigMap:", fetchError);
                setError("There is an error fetching your config. Please check your K8s setup. It is expected that your configmap is available at namespace yunikorn with the name yunikorn-configs");
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchConfigMap();
    }, []);

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-5 flex flex-col min-h-screen h-screen">
            <h1 className="text-2xl font-semibold mb-5 flex justify-center items-center h-20">Manage Queues</h1>
            <PartitionManagement setPartition={setSelectedPartition} partitions={configMapObject?.partitions} />
            {selectedQueues ? <></> : (
                <div className="h-full w-full flex justify-center items-center">
                    Please select a partition to continue
                </div>
            )}
        </div>
    );
}
