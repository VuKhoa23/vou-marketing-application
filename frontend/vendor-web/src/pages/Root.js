import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";

function RootLayout() {
    return (
        <ProtectedRoute>
            <MainNavigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </ProtectedRoute>
    );
}

export default RootLayout;