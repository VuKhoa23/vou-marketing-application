import { Metadata } from "next";
import Menu from "@/components/Menu";
import "../globals.css";

export const metadata: Metadata = {
    title: "VOU Admin",
    description: "Admin dashboard for VOU Marketing Application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="flex min-h-screen max-h-screen min-w-screen bg-gray-100">
                <div className="flex bg-blue-500 w-64 min-w-64 max-w-64">
                    <Menu />
                </div>
                <div className="overflow-y-auto overflow-x-hidden w-full p-9">{children}</div>
            </body>
        </html>
    );
}
