export default function DashboardHeader({ onAddRequester }) {
    return (
        <div className="flex items-start justify-between gap-4">

            <div>
                <h1 className="text-3xl font-bold">
                    Tableau de bord
                </h1>

                <p className="text-gray-500 mt-1">
                    Gérez les caisses et les demandes.
                </p>
            </div>

        </div>
    );
}