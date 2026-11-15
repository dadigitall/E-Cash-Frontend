import {
  ArrowLeftRight,
  FileText,
  History,
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";

import { normaliser } from "../../theme/companies";

export const MENUS = {
  manager: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/dashboard/caisses", label: "Caisses", icon: Wallet },
    {
      to: "/dashboard/emprunts",
      label: "Emprunts intercaisses",
      icon: ArrowLeftRight,
    },
    { to: "/dashboard/utilisateurs", label: "Utilisateurs", icon: Users },
    { to: "/dashboard/historique", label: "Historique", icon: History },
    { to: "/dashboard/rapport", label: "Rapport", icon: FileText },
  ],
  supervisor: [
    {
      to: "/dashboard/superviseur",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/dashboard/superviseur/emprunts",
      label: "Emprunts intercaisses",
      icon: ArrowLeftRight,
    },
    { to: "/dashboard/utilisateurs", label: "Utilisateurs", icon: Users },
    {
      to: "/dashboard/superviseur/historique",
      label: "Historique",
      icon: History,
    },
    {
      to: "/dashboard/superviseur/rapport",
      label: "Rapport",
      icon: FileText,
    },
  ],
  requester: [
    { to: "/dashboard", label: "Mes dépenses", icon: Receipt, end: true },
  ],
};

// Rôles de la base : demandeur | gestionnaire (manager) | superviseur
export function menuKey(auth) {
  const brut =
    auth?.role?.nom ??
    auth?.role ??
    auth?.user?.role ??
    auth?.user?.poste?.role ??
    auth?.poste?.role ??
    "";
  const role = normaliser(String(brut));

  if (role.includes("superv")) return "supervisor";
  if (role.includes("gestion") || role.includes("manager")) return "manager";

  // Rôle inconnu ou demandeur : menu le plus restreint
  return "requester";
}
