import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/LoginPage";

import DashboardPage from "../pages/dashboard/DashboardPage";
import SupervisorDashboard from "../pages/dashboard/SupervisorDashboard";

import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import DefinePasswordPage from "../pages/DefinePasswordPage";

import CashboxesPage from "../pages/cashboxes/CashboxesPage";
import Rapport from "../components/Supervisor/rapport/Rapport";
import Employee from "../components/Supervisor/employee/Employee";

import IntercashLoansPage from "../pages/loans/IntercashLoansPage";

export default function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<LoginPage />}
            />

            <Route
                path="/mot-de-passe/oublie"
                element={<ForgotPasswordPage />}
            />

            <Route
                path="/definir-mot-de-passe"
                element={<DefinePasswordPage />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                {/* ========================= */}
                {/* ROUTES COMMUNES / MANAGER */}
                {/* ========================= */}

                <Route
                    index
                    element={<DashboardPage />}
                />

                <Route
                    path="historique"
                    element={<DashboardPage />}
                />

                <Route
                    path="caisses"
                    element={<CashboxesPage />}
                />

                <Route
                    path="rapport"
                    element={<Rapport />}
                />

                {/* Utilisateurs (commune) */}
                <Route
                    path="utilisateurs"
                    element={<Employee />}
                />

                {/* Emprunts intercaisses MANAGER */}
                <Route
                    path="emprunts"
                    element={<IntercashLoansPage />}
                />


                {/* ========================= */}
                {/* ROUTES SUPERVISEUR */}
                {/* ========================= */}

                <Route
                    path="superviseur"
                    element={<SupervisorDashboard />}
                />

                <Route
                    path="superviseur/historique"
                    element={<SupervisorDashboard />}
                />

                <Route
                    path="superviseur/rapport"
                    element={<Rapport />}
                />

                {/* Emprunts intercaisses SUPERVISEUR */}
                <Route
                    path="superviseur/emprunts"
                    element={<IntercashLoansPage />}
                />

            </Route>

        </Routes>
    );
}