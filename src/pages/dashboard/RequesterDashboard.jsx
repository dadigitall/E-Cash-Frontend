import { useEffect, useState } from "react";
import api from "../../services/api";

import NewRequestButton from "../../components/requester/NewRequestButton";
import NewRequestForm from "../../components/requester/NewRequestForm";
import RequestHistory from "../../components/requester/RequestHistory";

export default function RequesterDashboard() {

    const [showForm, setShowForm] = useState(false);

    // Demandes de la page actuelle
    const [requests, setRequests] = useState([]);

    // Informations de pagination Laravel
    const [requestsPagination, setRequestsPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });


    const activeStatuses = [
        "en_attente",
        "acceptee",
        "preuve_envoyee",
    ];


    const hasActiveRequest = requests.some(request =>
        activeStatuses.includes(request.statut)
    );


    // =====================================================
    // RÉCUPÉRATION DES DEMANDES
    // =====================================================

    async function fetchRequests(page = 1) {

        try {

            const response = await api.get(
                `/demandes/mes-demandes?page=${page}`
            );

            console.log(
                "Réponse demandes :",
                response.data
            );

            setRequests(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.data ?? []
            );


            // Si Laravel renvoie une pagination
            if (response.data.data) {

                setRequestsPagination({

                    current_page:
                        response.data.current_page ?? 1,

                    last_page:
                        response.data.last_page ?? 1,

                    per_page:
                        response.data.per_page ?? 10,

                    total:
                        response.data.total ?? 0,

                });

            }

        } catch (error) {

            console.error(
                "Erreur récupération demandes :",
                error.response?.data || error
            );

        }
    }


    // =====================================================
    // CHARGEMENT INITIAL
    // =====================================================

    useEffect(() => {

        fetchRequests();

    }, []);


    // =====================================================
    // APRÈS CRÉATION D'UNE DEMANDE
    // =====================================================

    async function addRequest() {

        await fetchRequests(1);

        setShowForm(false);

    }


    // =====================================================
    // PAGINATION
    // =====================================================

    function changerPage(page) {

        if (
            page < 1 ||
            page > requestsPagination.last_page
        ) {
            return;
        }

        fetchRequests(page);

    }


    return (

        <div className="max-w-5xl mx-auto">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Mes dépenses
                </h1>

                <p className="text-gray-500">
                    Retrouvez toutes vos demandes.
                </p>

            </div>


            {/* ==========================================
                NOUVELLE DEMANDE
            ========================================== */}

            {!hasActiveRequest && !showForm && (

                <NewRequestButton
                    onClick={() =>
                        setShowForm(true)
                    }
                />

            )}


            {/* ==========================================
                FORMULAIRE
            ========================================== */}

            {showForm && (

                <NewRequestForm
                    onClose={() =>
                        setShowForm(false)
                    }
                    onAddRequest={addRequest}
                />

            )}


            {/* ==========================================
                DEMANDE ACTIVE
            ========================================== */}

            {hasActiveRequest && !showForm && (

                <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">

                    <h3 className="font-semibold text-amber-700">
                        Une demande est déjà en cours
                    </h3>

                    <p className="text-sm text-amber-600 mt-2">
                        Vous pourrez créer une nouvelle demande
                        lorsque votre demande actuelle sera
                        terminée ou rejetée.
                    </p>

                </div>

            )}


            {/* ==========================================
                HISTORIQUE
            ========================================== */}

            <RequestHistory
                requests={requests}
                onProofUploaded={() =>
                    fetchRequests(requestsPagination.current_page)
                }
            />


            {/* ==========================================
                PAGINATION
            ========================================== */}

            {requestsPagination.last_page > 1 && (

                <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">

                    <button
                        type="button"
                        onClick={() =>
                            changerPage(
                                requestsPagination.current_page - 1
                            )
                        }
                        disabled={
                            requestsPagination.current_page === 1
                        }
                        className="px-4 py-2 border rounded-lg
                                   disabled:opacity-40
                                   disabled:cursor-not-allowed
                                   hover:bg-gray-50"
                    >
                        Précédent
                    </button>


                    {Array.from(
                        {
                            length:
                                requestsPagination.last_page,
                        },
                        (_, index) => index + 1
                    ).map((page) => (

                        <button
                            type="button"
                            key={page}
                            onClick={() =>
                                changerPage(page)
                            }
                            className={`min-w-10 px-3 py-2 rounded-lg ${
                                requestsPagination.current_page === page
                                    ? "bg-blue-600 text-white"
                                    : "border hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>

                    ))}


                    <button
                        type="button"
                        onClick={() =>
                            changerPage(
                                requestsPagination.current_page + 1
                            )
                        }
                        disabled={
                            requestsPagination.current_page ===
                            requestsPagination.last_page
                        }
                        className="px-4 py-2 border rounded-lg
                                   disabled:opacity-40
                                   disabled:cursor-not-allowed
                                   hover:bg-gray-50"
                    >
                        Suivant
                    </button>

                </div>

            )}


            {requestsPagination.total > 0 && (

                <p className="text-center text-sm text-gray-400 pt-2">

                    Page {requestsPagination.current_page}
                    {" "}sur{" "}
                    {requestsPagination.last_page}

                </p>

            )}

        </div>

    );
}