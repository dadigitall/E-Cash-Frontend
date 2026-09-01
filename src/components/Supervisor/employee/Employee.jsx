import { useEffect, useState } from "react";
import api from "../../../services/api";
import AddRequesterModal from "../../users/AddRequesterModal";

const PAR_PAGE = 10;

export default function Employee() {

    const [employees, setEmployees] = useState([]);
    const [entreprises, setEntreprises] = useState([]);

    const [entreprise, setEntreprise] = useState("Toutes");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isRequesterModalOpen, setIsRequesterModalOpen] =
        useState(false);


    // =========================
    // CHARGEMENT DES EMPLOYÉS
    // =========================

    async function fetchEmployees() {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/users");

            const users =
                response.data?.users ??
                response.data?.data ??
                [];

            setEmployees(users);

        } catch (error) {

            console.error(
                "Erreur chargement employés :",
                error.response?.data ?? error
            );

            setError(
                "Impossible de charger les employés."
            );

        } finally {

            setLoading(false);

        }

    }


    // =========================
    // CHARGEMENT DES ENTREPRISES
    // =========================

    async function fetchEntreprises() {

        try {

            const response = await api.get("/entreprises");

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ?? [];

            setEntreprises(data);

        } catch (error) {

            console.error(
                "Erreur chargement entreprises :",
                error.response?.data ?? error
            );

        }

    }


    useEffect(() => {

        fetchEmployees();
        fetchEntreprises();

    }, []);


    // =========================
    // FILTRAGE
    // =========================

    const filteredEmployees =
        employees.filter((employee) => {

            if (entreprise === "Toutes") {
                return true;
            }

            return (
                employee?.entreprise?.nom === entreprise
            );

        });


    // =========================
    // PAGINATION (frontend)
    // =========================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEmployees.length / PAR_PAGE)
    );

    const employeesPage = filteredEmployees.slice(
        (page - 1) * PAR_PAGE,
        page * PAR_PAGE
    );

    // Revenir à la page 1 quand le filtre change
    useEffect(() => {

        setPage(1);

    }, [entreprise]);


    // =========================
    // AJOUT EMPLOYÉ
    // =========================

    async function handleEmployeeCreated() {

        setIsRequesterModalOpen(false);

        await fetchEmployees();

    }


    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Employés
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Gestion des employés de DA Digit All et Greenpay
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setIsRequesterModalOpen(true)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    + Ajouter un utilisateur
                </button>

            </div>


            {/* FILTRE ENTREPRISE */}

            <div className="bg-white rounded-xl shadow p-4">

                <div className="flex items-center gap-4">

                    <label className="font-medium text-gray-700">
                        Entreprise
                    </label>

                    <select
                        value={entreprise}
                        onChange={(e) =>
                            setEntreprise(e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >

                        <option value="Toutes">
                            Toutes
                        </option>

                        {entreprises.map((item) => (

                            <option
                                key={item.id}
                                value={item.nom}
                            >
                                {item.nom}
                            </option>

                        ))}

                    </select>

                </div>

            </div>


            {/* ERREUR */}

            {error && (

                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    Chargement des employés...
                </div>

            ) : (

                <>

                    <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">

                        {/* TABLE */}

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="text-left px-6 py-4">
                                        Nom
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Email
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Téléphone
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Poste
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Entreprise
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {employeesPage.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Aucun employé trouvé.
                                        </td>

                                    </tr>

                                ) : (

                                    employeesPage.map((employee) => (

                                        <tr
                                            key={employee.id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 font-medium">
                                                {employee.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {employee.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                {employee.telephone_whatsapp ?? "-"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {employee.poste?.nom ?? "-"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {employee.entreprise?.nom ?? "-"}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* PAGINATION */}

                    {totalPages > 1 && (

                        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">

                            <button
                                type="button"
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                        hover:bg-gray-50"
                            >
                                Précédent
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((p) => (
                                <button
                                    type="button"
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`min-w-10 px-3 py-2 rounded-lg ${
                                        page === p
                                            ? "bg-blue-600 text-white"
                                            : "border hover:bg-gray-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
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


            {/* MODAL AJOUT */}

            <AddRequesterModal

                isOpen={isRequesterModalOpen}

                onClose={() =>
                    setIsRequesterModalOpen(false)
                }

                onSuccess={handleEmployeeCreated}

            />

        </div>

    );

}