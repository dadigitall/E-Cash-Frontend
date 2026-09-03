import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function NewRequestForm({ onClose, onAddRequest }) {

    const [motif, setMotif] = useState("");
    const [montantEstime, setMontantEstime] = useState("");
    const { auth } = useAuth();

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const response = await api.post("/demandes", {
                motif,
                montant_estime: montantEstime,
            });

            onAddRequest(response.data);

        } catch (error) {

            console.error(error);

        }

    }

    return (

        <div className="bg-white rounded-xl shadow p-6 mb-8">

            <div className="flex justify-between mb-5">

                <h2 className="font-semibold text-xl">

                    Nouvelle demande

                </h2>

                <button onClick={onClose}>
                    ✕
                </button>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <div>

                    <label>
                        Motif
                    </label>

                    <input
                        className="w-full border rounded-lg p-3"
                        value={motif}
                        onChange={(e) => setMotif(e.target.value)}
                    />

                </div>

                <div>

                    <label>
                        Montant estimé
                    </label>

                    <input
                        type="number"
                        className="w-full border rounded-lg p-3"
                        value={montantEstime}
                        onChange={(e) => setMontantEstime(e.target.value)}
                    />

                </div>

                <div>

                    <label>
                        Entreprise
                    </label>

                    <input
                        disabled
                        value={auth.user.entreprise.nom}
                        className="w-full border rounded-lg p-3 bg-gray-100"
                    />

                </div>

                <button
                    className="bg-blue-600 text-white rounded-lg px-5 py-3 w-full"
                >

                    Soumettre la demande

                </button>

            </form>

        </div>

    );

}