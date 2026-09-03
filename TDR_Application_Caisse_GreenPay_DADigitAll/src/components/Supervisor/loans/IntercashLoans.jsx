import LoanCard from "./LoanCard";

export default function IntercashLoans({ emprunts }) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="px-6 py-4 border-b">

                <h2 className="text-lg font-semibold">
                    Emprunts inter-caisses
                </h2>

                <p className="text-sm text-gray-500">
                    {emprunts.length} emprunt{emprunts.length > 1 ? "s" : ""}
                </p>

            </div>

            {emprunts.length === 0 ? (

                <div className="p-8 text-center text-gray-500">
                    Aucun emprunt.
                </div>

            ) : (

                <div className="divide-y">

                    {emprunts.map((emprunt) => (

                        <LoanCard
                            key={emprunt.id}
                            emprunt={emprunt}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}