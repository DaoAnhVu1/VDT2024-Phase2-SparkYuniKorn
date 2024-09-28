import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecursiveQueueCapacity from './recursive-queue-capacity';
import QueueInfoSheet from '@/components/modals/queue-info'

interface QueueCapacityFetchProps {
    partitionName: string;
}

export default function QueueCapacityFetch({ partitionName }: QueueCapacityFetchProps) {
    const [queueCapacityInfo, setQueueCapacityInfo] = useState<any>(null);
    useEffect(() => {
        const fetchQueueCapacity = async () => {
            try {
                const response = await axios.get(`http://localhost:9889/ws/v1/partition/${partitionName}/queues`);
                console.log(response.data)
                setQueueCapacityInfo(response.data);
            } catch (error) {
                console.error('Error fetching queue capacity info:', error);
            }
        };

        fetchQueueCapacity();
    }, [partitionName]);

    return (
        <div>
            {queueCapacityInfo ? (
                <div className='flex gap-3'>
                    <RecursiveQueueCapacity queueList={[queueCapacityInfo]} />
                    <QueueInfoSheet />
                </div>

            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
