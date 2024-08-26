"use client"
import Link from "next/link"
import Image from "next/image"
import ViettelLogo from "@/public/logo.png"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Info", path: "/info" },
        { name: "Manage Queues", path: "/manage-queue" }
    ]

    return (
        <div className="w-60 fixed h-screen bg-gray-300 flex flex-col items-center p-5">
            <div className="relative w-full h-20">
                <Image src={ViettelLogo} alt="Logo" fill className="object-contain" />
            </div>

            <div className="w-full flex flex-col gap-3">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={"" + `${pathname === link.path ? "font-semibold" : ""
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
