"use client";

import "./globals.css";
import Menu from "@/components/Menu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/lib/redux/slices/authSlice";
import Cookies from "js-cookie";

export default function NavLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const dispatch = useDispatch();

    useEffect(() => {
        const storedAccessToken = Cookies.get("adminToken");

        if (storedAccessToken) {
            dispatch(setAuthUser({ accessToken: storedAccessToken }));
        }
    }, [dispatch]);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen max-h-screen min-w-screen bg-gray-100">
                <Menu />
                <div className="overflow-y-auto overflow-x-hidden w-full p-9">{children}</div>
            </div>
        </ProtectedRoute>
    );
}
