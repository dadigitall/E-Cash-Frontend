import RequestsTable from "../requests/RequestsTable";

export default function SupervisorHistory({
    demandes,
    pagination,
    currentPage,
    onPageChange,
}) {

    return (

        <section className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Historique des demandes
                </h1>

                <p className="text-gray-500 mt-1">
                    Consultez l'ensemble des demandes effectuées
                    par les employés.
                </p>

            </div>


            {demandes.length === 0 ? (

                <div className="bg-white rounded-2xl border p-8 text-center">

                    <p className="text-gray-500">
                        Aucune demande dans l'historique.
                    </p>

                </div>

            ) : (

                <>

                    <RequestsTable
                        demandes={demandes}
                    />


                    {pagination.last_page > 1 && (

                        <div className="flex items-center justify-center gap-2 pt-4">

                            <button
                                type="button"
                                onClick={() =>
                                    onPageChange(
                                        currentPage - 1
                                    )
                                }
                                disabled={currentPage === 1}
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
                                        pagination.last_page,
                                },
                                (_, index) =>
                                    index + 1
                            ).map((page) => (

                                <button
                                    type="button"
                                    key={page}
                                    onClick={() =>
                                        onPageChange(page)
                                    }
                                    className={`px-4 py-2 rounded-lg ${
                                        currentPage === page
                                            ? "bg-blue-600 text-white"
                                            : "border hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>

                            ))}


                            <button
                                type="button"
                                onClick={() =>
                                    onPageChange(
                                        currentPage + 1
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    pagination.last_page
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

                </>

            )}

        </section>

    );
}