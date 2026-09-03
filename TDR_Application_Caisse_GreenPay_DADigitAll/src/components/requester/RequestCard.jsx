import { useState } from "react";
import ProofUploadModal from "./ProofUploadModal";

export default function RequestCard({ request, onProofUploaded }) {

    const [showProofModal, setShowProofModal] = useState(false);

    const status = {
        en_attente: {
            label: "En attente",
            color: "bg-yellow-100 text-yellow-700",
            message: "Votre demande est en attente de validation."
        },

        acceptee: {
            label: "Acceptée",
            color: "bg-green-100 text-green-700",
            message: "Votre demande a été acceptée. Vous pouvez retirer les fonds."
        },

        preuve_envoyee: {
            label: "Preuve envoyée",
            color: "bg-blue-100 text-blue-700",
            message: "Votre preuve est en cours de vérification."
        },

        preuve_rejetee: {
            label: "Preuve rejetée",
            color: "bg-red-100 text-red-700",
            message: "Votre preuve a été rejetée. Merci d'en déposer une nouvelle."
        },

        terminee: {
            label: "Terminée",
            color: "bg-green-100 text-green-700",
            message: "Mission terminée."
        },

        rejetee: {
            label: "Rejetée",
            color: "bg-red-100 text-red-700",
            message: "Votre demande a été refusée."
        },
    };

    console.log(request);
    console.log(request.statut);
    const current = status[request.statut] ?? {
        label: request.statut,
        color: "bg-gray-100 text-gray-700",
        message: "Statut inconnu."
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow p-5">

                <div className="flex justify-between">

                    <div>

                        <h3 className="font-semibold text-lg">

                            {request.motif}

                        </h3>

                        <p className="text-sm text-gray-500 mt-1">

                            {new Date(request.created_at).toLocaleDateString("fr-FR")}

                        </p>

                    </div>

                    <div className="text-right">

                        <p className="font-bold text-lg">

                            {Number(request.montant_estime).toLocaleString("fr-FR")} FCFA

                        </p>

                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${current.color}`}>

                            {current.label}

                        </span>

                    </div>

                </div>

                <p className="text-gray-600 mt-4">

                    {current.message}

                </p>

                {(request.statut === "acceptee" ||
                    request.statut === "preuve_rejetee") && (

                    <button
                        onClick={() => {
                            console.log("clic détecté, showProofModal avant :", showProofModal);
                            setShowProofModal(true);
                        }}
                        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Déposer une preuve
                    </button>

                )}

            </div>

            <ProofUploadModal
                isOpen={showProofModal}
                onClose={() => setShowProofModal(false)}
                request={request}
                onSuccess={() => {

                    setShowProofModal(false);

                    onProofUploaded();

                }}
            />
        </>
    );
}