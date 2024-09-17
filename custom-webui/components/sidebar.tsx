"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Info, Network, LayoutDashboard, Share2 } from "lucide-react"

export default function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Info", path: "/info", icon: Info },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Queues Config", path: "/manage-queue", icon: Network },
        { name: "Queue Info", path: "queue-info", icon: Share2 }
    ]

    return (
        <div className="w-60 fixed h-screen flex flex-col items-center p-3 bg-[#1f2837]">
            <div className="flex relative text-2xl text-white font-semibold w-full mt-4 h-20 items-center pl-2">
                Dashboard
            </div>
            <div className="w-full flex flex-col gap-3 text-md text-white">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={"p-2 rounded-md " + `${pathname.startsWith(link.path) ? "font-semibold" : ""}`}
                    >
                        <div className="flex items-center gap-2">
                            {link.icon && <link.icon className="w-5 h-5" />}
                            {link.name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}