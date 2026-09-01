import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 min-w-0">

                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="flex-1 bg-gray-100 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}