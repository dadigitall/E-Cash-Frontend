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
const ROLES = ["gestionnaire", "superviseur", "demandeur"];

// Cherche un rôle connu dans l'objet d'authentification, quelle que soit sa forme
function trouverRole(ctx) {
  const candidats = [
    ctx?.role,
    ctx?.role?.nom,
    ctx?.user?.role,
    ctx?.user?.poste?.role,
    ctx?.user?.user?.role,
    ctx?.user?.user?.poste?.role,
    ctx?.poste?.role,
    ctx?.data?.role,
  ];
  for (const c of candidats) {
    const r = normaliser(String(c ?? ""));
    if (ROLES.includes(r)) return r;
  }
  return null;
}

// Retourne "manager" | "supervisor" | "requester" | null (rôle inconnu)
export function menuKey(ctx, roleApi) {
  const role = trouverRole(ctx) ?? normaliser(String(roleApi ?? ""));
  if (role === "superviseur") return "supervisor";
  if (role === "gestionnaire") return "manager";
  if (role === "demandeur") return "requester";
  return null;
}
