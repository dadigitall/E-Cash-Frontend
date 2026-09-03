import RequestRow from "./RequestRow";

export default function RequestsTable({ demandes }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                    Toutes les demandes
                </h2>

                <p className="text-sm text-gray-500">
                    {demandes.length} demande{demandes.length > 1 ? "s" : ""}
                </p>
            </div>

            {demandes.length === 0 ? (

                <div className="p-8 text-center text-gray-500">
                    Aucune demande trouvée.
                </div>

            ) : (

                <div className="divide-y">

                    {demandes.map((demande) => (

                        <RequestRow
                            key={demande.id}
                            demande={demande}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}