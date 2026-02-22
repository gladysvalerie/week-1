import { createBrowserRouter, Outlet, useLocation } from "react-router";
import Dashboard from "./pages/Dashboard";
import EntriesPage from "./pages/EntriesPage";
import Header from "./components/Header";

function Layout() {
    const { pathname } = useLocation()
    return (
        <div className="min-h-screen">
            <div className="fixed top-0 left-0 z-50 backdrop-blur">
                <Header />
            </div>
            <Outlet />
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {index: true, element: <Dashboard />},
            {
                path: "entries",
                element: <EntriesPage />
            }
        ]
    }
])