import { useAuth } from "../../context/AuthContext";

import RequesterDashboard from "./RequesterDashboard";
import ManagerDashboard from "./ManagerDashboard";
import SupervisorDashboard from "./SupervisorDashboard";

export default function DashboardPage() {

    const { auth } = useAuth();

    switch (auth.role) {

        case "demandeur":
            return <RequesterDashboard />;

        case "gestionnaire":
            return <ManagerDashboard />;

        case "superviseur":
            return <SupervisorDashboard />;

        default:
            return <p>Chargement...</p>;
    }

}