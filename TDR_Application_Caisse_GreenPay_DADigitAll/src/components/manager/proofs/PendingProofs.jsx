import ProofCard from "./ProofCard";

export default function PendingProofs({
    preuves,
    onValidate,
    onReject,
}) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <div className="mb-6">

                <h2 className="text-xl font-semibold">

                    Preuves à vérifier

                </h2>

                <p className="text-gray-500">

                    Vérifiez les justificatifs déposés par les employés.

                </p>

            </div>

            {preuves.length === 0 ? (

                <div className="text-center py-10 text-gray-500">

                    Aucune preuve en attente.

                </div>

            ) : (

                <div className="space-y-4">

                    {preuves.map((preuve) => (

                        <ProofCard
                            key={preuve.id}
                            preuve={preuve}
                            onValidate={onValidate}
                            onReject={onReject}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}