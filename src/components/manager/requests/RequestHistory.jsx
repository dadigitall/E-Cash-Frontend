export default function RequestHistory({ demandes }) {
    const status = {
        en_attente: {
            label: "En attente",
            color: "bg-yellow-100 text-yellow-700",
        },

        acceptee: {
            label: "Acceptée",
            color: "bg-green-100 text-green-700",
        },

        preuve_envoyee: {
            label: "Preuve envoyée",
            color: "bg-blue-100 text-blue-700",
        },

        preuve_rejetee: {
            label: "Preuve rejetée",
            color: "bg-red-100 text-red-700",
        },

        terminee: {
            label: "Terminée",
            color: "bg-green-100 text-green-700",
        },

        rejetee: {
            label: "Rejetée",
            color: "bg-red-100 text-red-700",
        },
    };

    return (
        <div className="space-y-4">

            {demandes.map((demande) => {

                const current = status[demande.statut] ?? {
                    label: demande.statut ?? "Inconnu",
                    color: "bg-gray-100 text-gray-700",
                };

                return (
                    <div
                        key={demande.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
                    >

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                            {/* ================================
                                INFORMATIONS DEMANDEUR
                            ================================= */}

                            <div>

                                <h3 className="font-semibold text-lg text-gray-900">
                                    {demande.user?.name ??
                                        demande.user?.nom ??
                                        "Utilisateur inconnu"}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {demande.user?.entreprise?.nom ??
                                        demande.entreprise?.nom ??
                                        ""}
                                </p>

                                <p className="text-gray-700 mt-4">
                                    {demande.motif}
                                </p>

                            </div>


                            {/* ================================
                                MONTANT + DATE
                            ================================= */}

                            <div className="text-left md:text-right">

                                <p className="font-bold text-lg text-gray-900">
                                    {Number(
                                        demande.montant_estime ?? 0
                                    ).toLocaleString("fr-FR")}{" "}
                                    FCFA
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    {demande.created_at
                                        ? new Date(
                                            demande.created_at
                                        ).toLocaleDateString("fr-FR")
                                        : "-"}
                                </p>

                                <span
                                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${current.color}`}
                                >
                                    {current.label}
                                </span>

                            </div>

                        </div>

                    </div>
                );
            })}

        </div>
    );
}