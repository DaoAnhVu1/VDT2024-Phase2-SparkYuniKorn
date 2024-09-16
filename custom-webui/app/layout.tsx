import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/sidebar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yunikorn Queue Management App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <main className="ml-60 bg-gray-100">
          <div className='p-4'>
            <div className='bg-white rounded-md shadow-md'>
              {children}
            </div>
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
