"use client";

import "./globals.css";
import Menu from "@/components/Menu";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function NavLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen max-h-screen min-w-screen bg-gray-100">
                <div className="flex bg-blue-500 w-64 min-w-64 max-w-64">
                    <Menu />
                </div>
                <div className="overflow-y-auto overflow-x-hidden w-full p-9">{children}</div>
            </div>
        </ProtectedRoute>
    );
}
