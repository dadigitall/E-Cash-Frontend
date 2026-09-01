const menus = {
    demandeur: [
        {
            label: "Dashboard",
            path: "/dashboard",
        },
    ],

    gestionnaire: [
        {
            label: "Dashboard",
            path: "/dashboard",
        },
        {
            label: "Caisses",
            path: "/dashboard/caisses",
        },
        {
            label: "Emprunts intercaisses",
            path: "/dashboard/emprunts",
        },
        {
            label: "Utilisateurs",
            path: "/dashboard/utilisateurs",
        },
        {
            label: "Historique",
            path: "/dashboard/historique",
        },
        {
            label: "Rapport",
            path: "/dashboard/rapport",
        },
    ],

    superviseur: [
        {
            label: "Dashboard",
            path: "/dashboard/superviseur",
        },
        {
            label: "Utilisateurs",
            path: "/dashboard/utilisateurs",
        },
        {
            label: "Emprunts intercaisses",
            path: "/dashboard/superviseur/emprunts",
        },
        {
            label: "Historique",
            path: "/dashboard/superviseur/historique",
        },
        {
            label: "Rapport",
            path: "/dashboard/superviseur/rapport",
        },
    ],
};

export default menus;