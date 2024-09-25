import { Info, Network, LayoutDashboard, Share2, ReplaceAll, Replace } from "lucide-react";
import Link from "next/link";
export default function InfoPage() {

    const links = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, description: "This page views the overall status of the Kubernetes Cluster and can include more metrics if needed." },
        { name: "Queues Config", path: "/manage-queue", icon: Network, description: "Configure the queue of YuniKorn at a detailed level." },
        { name: "Placement Rules", path: "/placementrules", icon: Replace, description: "Configure the placement rules of YuniKorn in detail." },
    ];

    return (
        <div className="p-5 flex flex-col min-h-screen h-screen">
            <h1 className="text-2xl font-semibold mb-5 flex justify-center items-center h-20">
                Info
            </h1>

            <div className="flex flex-col gap-3">
                {links.map((link, index) => (
                    <Link
                        href={link.path}
                        key={index}
                        className="flex flex-col p-4 border rounded-md shadow cursor-pointer"
                    >
                        <div className="flex items-center mb-2">
                            <link.icon className="w-6 h-6 mr-2" />
                            <h2 className="text-xl font-semibold">{link.name}</h2>
                        </div>
                        <p className="text-gray-600">{link.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
