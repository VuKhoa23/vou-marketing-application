import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import Footer from "../components/Footer";

function RootLayout() {
    return <div className="min-h-screen">
        <MainNavigation />
        <main>
            <Outlet />
        </main>
        <Footer />
    </div>
}

export default RootLayout;