import { useState } from "react";
import ValidateWithoutProofModal from "./ValidateWithoutProofModal";

export default function PendingRequests({
    demandes,
    onAccept,
    onValidateWithoutProof,
    onReject,
}) {

    const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);

    function openValidateModal(demande) {
        setSelectedDemande(demande);
        setIsValidateModalOpen(true);
    }

    async function handleConfirmValidate(id, commentaire) {
        await onValidateWithoutProof(id, commentaire);
        setIsValidateModalOpen(false);
        setSelectedDemande(null);
    }

    return (

        <div>

            <h2 className="text-xl font-semibold">
                Demandes à traiter
            </h2>

            <p className="text-gray-500 mb-5">
                Acceptez ou validez les demandes de dépenses.
            </p>

            {demandes.length === 0 ? (

                <p className="text-gray-500">
                    Aucune demande en attente.
                </p>

            ) : (

                <div className="space-y-4">

                    {demandes.map((demande) => (

                        <div
                            key={demande.id}
                            className="border rounded-xl p-5 flex justify-between items-center"
                        >

                            <div>

                                <div className="flex items-center gap-2">

                                    <h3 className="font-semibold">
                                        {demande.user.name}
                                    </h3>

                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        {demande.entreprise.nom}
                                    </span>

                                </div>

                                <p className="mt-2 text-gray-700">
                                    {demande.motif}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(
                                        demande.created_at
                                    ).toLocaleDateString("fr-FR")}
                                </p>

                                {demande.statut === "acceptee" && (

                                    <p className="text-sm text-green-600 mt-2">
                                        Demande acceptée — en attente de validation finale.
                                    </p>

                                )}

                            </div>

                            <div className="text-right">

                                <p className="font-bold text-lg mb-4">
                                    {Number(
                                        demande.montant_estime
                                    ).toLocaleString("fr-FR")} FCFA
                                </p>

                                <div className="flex gap-3 justify-end">

                                    {demande.statut === "en_attente" && (

                                        <>
                                            <button
                                                onClick={() =>
                                                    onAccept(demande.id)
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                                            >
                                                Accepter
                                            </button>

                                            <button
                                                onClick={() =>
                                                    onReject(demande.id)
                                                }
                                                className="border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2 rounded-lg"
                                            >
                                                Refuser
                                            </button>
                                        </>

                                    )}

                                    {demande.statut === "acceptee" && (

                                        <button
                                            onClick={() =>
                                                openValidateModal(demande)
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                                        >
                                            Valider
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            <ValidateWithoutProofModal
                isOpen={isValidateModalOpen}
                onClose={() => {
                    setIsValidateModalOpen(false);
                    setSelectedDemande(null);
                }}
                demande={selectedDemande}
                onConfirm={handleConfirmValidate}
            />

        </div>
    );
}