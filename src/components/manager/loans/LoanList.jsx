import { useState, useEffect } from "react";

const PAR_PAGE = 10;

export default function LoanList({
    emprunts,
    onRepay,
    loading = false,
}) {

    const [page, setPage] = useState(1);

    const totalPages = Math.max(
        1,
        Math.ceil(emprunts.length / PAR_PAGE)
    );

    const empruntsPage = emprunts.slice(
        (page - 1) * PAR_PAGE,
        page * PAR_PAGE
    );

    // Revenir à la page 1 si la liste change (ex : après un remboursement)
    useEffect(() => {

        setPage(1);

    }, [emprunts.length]);


    if (loading) {
        return (
            <p className="text-gray-500">
                Chargement des emprunts...
            </p>
        );
    }

    if (emprunts.length === 0) {
        return (
            <p className="text-gray-500">
                Aucun emprunt enregistré.
            </p>
        );
    }

    return (
        <div className="space-y-4">

            {empruntsPage.map((emprunt) => {

                const preteuse =
                    emprunt.caisse_preteuse ||
                    emprunt.caissePreteuse;

                const emprunteuse =
                    emprunt.caisse_emprunteuse ||
                    emprunt.caisseEmprunteuse;

                const estEnCours =
                    emprunt.statut === "en_cours" ||
                    emprunt.statut === "en cours";

                return (
                    <div
                        key={emprunt.id}
                        className="border rounded-xl p-5"
                    >

                        <div className="flex justify-between gap-6">

                            <div>

                                <h3 className="font-semibold text-lg">
                                    {preteuse?.nom}
                                    {" → "}
                                    {emprunteuse?.nom}
                                </h3>

                                <p className="text-gray-600 mt-1">
                                    {emprunt.motif}
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    {emprunt.date_emprunt
                                        ? new Date(
                                              emprunt.date_emprunt
                                          ).toLocaleDateString(
                                              "fr-FR"
                                          )
                                        : new Date(
                                              emprunt.created_at
                                          ).toLocaleDateString(
                                              "fr-FR"
                                          )}
                                </p>

                            </div>

                            <div className="text-right">

                                <p className="font-bold text-lg">
                                    {Number(
                                        emprunt.montant
                                    ).toLocaleString(
                                        "fr-FR"
                                    )}{" "}
                                    FCFA
                                </p>

                                <span
                                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                                        estEnCours
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    {estEnCours
                                        ? "En cours"
                                        : "Remboursé"}
                                </span>

                            </div>

                        </div>

                        {estEnCours && (
                            <div className="mt-4 flex justify-end">

                                <button
                                    onClick={() =>
                                        onRepay(emprunt.id)
                                    }
                                    className="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg"
                                >
                                    Rembourser
                                </button>

                            </div>
                        )}

                    </div>
                );
            })}


            {totalPages > 1 && (

                <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">

                    <button
                        type="button"
                        onClick={() =>
                            setPage((p) => Math.max(1, p - 1))
                        }
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                hover:bg-gray-50"
                    >
                        Précédent
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((p) => (
                        <button
                            type="button"
                            key={p}
                            onClick={() => setPage(p)}
                            className={`min-w-10 px-3 py-2 rounded-lg ${
                                page === p
                                    ? "bg-blue-600 text-white"
                                    : "border hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded-lg
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                hover:bg-gray-50"
                    >
                        Suivant
                    </button>

                </div>

            )}

        </div>
    );
}