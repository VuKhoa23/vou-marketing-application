import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "VOU Admin",
    description: "Admin dashboard for VOU Marketing Application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="flex min-h-screen bg-white">{children}</body>
        </html>
    );
}
