import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import Footer from "../components/Footer";
import { ChakraProvider } from '@chakra-ui/react'

function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <MainNavigation />
            <ChakraProvider>
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </ChakraProvider>
        </div>
    );
}

export default RootLayout;