import RequestHistory from "../requests/RequestHistory";

export default function HistorySection({ demandes }) {

    return (

        <section className="space-y-4">

            {demandes.length === 0 ? (

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">

                    <p className="text-gray-500">
                        Aucune demande dans l'historique.
                    </p>

                </div>

            ) : (

                <RequestHistory
                    demandes={demandes}
                />

            )}

        </section>

    );
}