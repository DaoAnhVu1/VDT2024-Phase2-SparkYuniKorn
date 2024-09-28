"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import LogsComponent from './logs-component';

interface AllocationInfoProps {
    allocationList: { allocationKey: string }[];
}

export default function AllocationInfo({ allocationList }: AllocationInfoProps) {
    const [allocations, setAllocations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [namespacePod, setNamespacePod] = useState("");


    useEffect(() => {
        const fetchAllocations = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:9889/ws/v1/partition/default/nodes');
                const allAllocations = response.data.flatMap((item: any) => item.allocations || []);
                const allocationKeys = new Set(allocationList.map(allocation => allocation.allocationKey));
                const filteredAllocations = allAllocations.filter((allocation: any) => allocationKeys.has(allocation.allocationKey));
                setAllocations(filteredAllocations);
            } catch (error) {
                console.error('Error fetching allocations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllocations();
    }, [allocationList]);

    return (
        <div className="flex flex-col gap-3">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='p-5'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pod Name</TableHead>
                                <TableHead>Node ID</TableHead>
                                <TableHead>Resources</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allocations.map((allocation, index) => {
                                const memoryMiB = (allocation.resource.memory / (1024 * 1024)).toFixed(2);
                                const vcore = (allocation.resource.vcore / 1000).toFixed(2);
                                const podName = allocation.allocationTags["kubernetes.io/meta/podName"];
                                const namespace = allocation.allocationTags["kubernetes.io/meta/namespace"];

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{`${namespace}/${podName}`}</TableCell>
                                        <TableCell>{allocation.nodeId}</TableCell>
                                        <TableCell>{`Memory: ${memoryMiB} MiB, vCore: ${vcore}`}</TableCell>
                                        <TableCell>{allocation.priority}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setNamespacePod(`${namespace}/${podName}`)}>Logs</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <div className='mt-5 p-5'>
                        <p className='mb-3'>Logs</p>
                        <div className='bg-gray-100 w-full h-80 rounded-md flex items-center justify-center'>
                            {namespacePod ? (
                                <LogsComponent namespacePod={namespacePod} />
                            ) : (
                                <p className='text-gray-500 text-center'>Logs from pod will be displayed here.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
