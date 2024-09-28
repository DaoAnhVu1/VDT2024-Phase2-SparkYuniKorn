"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface LogsComponentProps {
    namespacePod: string;
}

export default function LogsComponent({ namespacePod }: LogsComponentProps) {
    const [logs, setLogs] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`/api/pod/logs?namespacePod=${namespacePod}`);
                setLogs(response.data);
            } catch (err: any) {
                setError('Error fetching logs: ' + err.message);
            }
        };

        fetchLogs();
    }, [namespacePod]);

    console.log(logs)

    return (
        <div>
            {error && <div>{error}</div>}
            {logs ? (
                <div className="flex h-80 overflow-scroll p-3" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{logs}</div>
            ) : (
                <div>Loading logs...</div>
            )}
        </div>
    );
}
