"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import AllocationInfo from "./allocationInfo";

interface QueueJobProp {
    queue: any;
    partition: any;
}

export default function QueueJob({ queue, partition }: QueueJobProp) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(
                    `http://localhost:9889/ws/v1/partition/${partition}/queue/${queue}/applications`
                );
                setApplications(response.data || []);
            } catch (err: any) {
                setError("Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };

        if (queue && partition) {
            fetchApplications();
        }
    }, [queue, partition]);

    return (
        <div>
            {loading && <p></p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && applications.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ApplicationID</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Used Memory (MB)</TableHead>
                            <TableHead>Used Pods</TableHead>
                            <TableHead>Used Vcore</TableHead>
                            <TableHead>Submission Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <Drawer>
                        <TableBody>
                            {applications.map((app: any) => {
                                const usedMemory = app?.usedResource?.memory
                                    ? app.usedResource.memory / (1024 * 1024)
                                    : "n/a";
                                const usedPods = app?.usedResource?.pods ?? "n/a";
                                const usedVcore = app?.usedResource?.vcore ?? "n/a";

                                return (
                                    <>
                                        <TableRow key={app.applicationID}>
                                            <TableCell>{app.applicationID}</TableCell>
                                            <TableCell>{app.applicationState}</TableCell>
                                            <TableCell>{usedMemory}</TableCell>
                                            <TableCell>{usedPods}</TableCell>
                                            <TableCell>{usedVcore}</TableCell>
                                            <TableCell>{new Date(app.submissionTime / 1e6).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <DrawerTrigger>
                                                    <Button>View</Button>
                                                </DrawerTrigger>
                                            </TableCell>
                                            <DrawerContent>
                                                <DrawerTitle className="p-5">App Info</DrawerTitle>
                                                <AllocationInfo allocationList={app.allocations} />
                                            </DrawerContent>
                                        </TableRow>
                                    </>
                                );
                            })}
                        </TableBody>
                    </Drawer>
                </Table>
            )}
            {!loading && !error && applications.length === 0 && (
                <p className="text-center">No applications found for the selected queue and partition.</p>
            )}
        </div>
    );
}
