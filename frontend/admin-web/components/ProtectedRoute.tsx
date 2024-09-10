"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setAuthUser } from "@/lib/redux/slices/authSlice";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const storedAccessToken = Cookies.get("adminToken");
        if (storedAccessToken && !accessToken) {
            dispatch(setAuthUser({ accessToken: storedAccessToken }));
        } else if (!accessToken) {
            router.push("/login");
        }
    }, [accessToken, router, dispatch]);

    if (!accessToken) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
