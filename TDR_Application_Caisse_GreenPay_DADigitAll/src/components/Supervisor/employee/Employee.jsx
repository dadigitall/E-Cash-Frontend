import { useEffect, useState } from "react";
import api from "../../../services/api";
import AddRequesterModal from "../../users/AddRequesterModal";
import EditEmployeeModal from "../../users/EditEmployeeModal";

const PAR_PAGE = 10;

// Palette d'avatars stable (dérivée du nom) — pas de dépendance externe
const AVATAR_PALETTE = [
    { bg: "bg-indigo-100", text: "text-indigo-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-sky-100", text: "text-sky-700" },
    { bg: "bg-violet-100", text: "text-violet-700" },
];

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}

function getAvatarColors(name) {
    if (!name) return AVATAR_PALETTE[0];
    const code = name
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

// Construit une liste de pages avec des "…" quand il y en a beaucoup
function buildPageList(current, total) {
    const delta = 1;
    const pages = [];
    const range = [];

    for (let i = 1; i <= total; i++) {
        if (
            i === 1 ||
            i === total ||
            (i >= current - delta && i <= current + delta)
        ) {
            range.push(i);
        }
    }

    let prev = 0;
    for (const p of range) {
        if (prev && p - prev > 1) pages.push("…");
        pages.push(p);
        prev = p;
    }

    return pages;
}

export default function Employee() {

    const [employees, setEmployees] = useState([]);
    const [entreprises, setEntreprises] = useState([]);

    const [entreprise, setEntreprise] = useState("Toutes");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isRequesterModalOpen, setIsRequesterModalOpen] = useState(false);

    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [deletingEmployee, setDeletingEmployee] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");


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

            const matchEntreprise =
                entreprise === "Toutes" ||
                employee?.entreprise?.nom === entreprise;

            const term = search.trim().toLowerCase();

            const matchSearch =
                term === "" ||
                employee?.name?.toLowerCase().includes(term) ||
                employee?.email?.toLowerCase().includes(term);

            return matchEntreprise && matchSearch;

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

    }, [entreprise, search]);


    // =========================
    // AJOUT EMPLOYÉ
    // =========================

    async function handleEmployeeCreated() {

        setIsRequesterModalOpen(false);

        await fetchEmployees();

    }


    // =========================
    // MODIFICATION EMPLOYÉ
    // =========================

    function openEditModal(employee) {

        setEditingEmployee(employee);
        setIsEditModalOpen(true);

    }

    async function handleEmployeeUpdated() {

        setIsEditModalOpen(false);
        setEditingEmployee(null);

        await fetchEmployees();

    }


    // =========================
    // SUPPRESSION EMPLOYÉ
    // =========================

    function openDeleteConfirm(employee) {

        setDeletingEmployee(employee);
        setDeleteError("");
        setIsDeleteConfirmOpen(true);

    }

    async function handleConfirmDelete() {

        setDeleting(true);
        setDeleteError("");

        try {

            await api.delete(`/users/${deletingEmployee.id}`);

            setIsDeleteConfirmOpen(false);
            setDeletingEmployee(null);

            await fetchEmployees();

        } catch (error) {

            console.error(
                "Erreur suppression employé :",
                error.response?.data ?? error
            );

            setDeleteError(
                error.response?.data?.message ??
                "Impossible de supprimer cet employé."
            );

        } finally {

            setDeleting(false);

        }

    }


    const pageList = buildPageList(page, totalPages);


    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-semibold text-slate-900">
                        Employés
                    </h1>

                    <p className="text-slate-500 mt-1 text-sm">
                        {filteredEmployees.length} employé{filteredEmployees.length > 1 ? "s" : ""} · DA Digit All & Greenpay
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setIsRequesterModalOpen(true)
                    }
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm shadow-indigo-600/20 transition-colors"
                >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
                    </svg>
                    Ajouter un utilisateur
                </button>

            </div>


            {/* FILTRES */}

            <div className="bg-white rounded-xl border border-slate-200 p-4">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                    <div className="relative flex-1">

                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.348 9.862l3.145 3.146a.75.75 0 1 0 1.06-1.06l-3.145-3.145A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd" />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un nom ou un email…"
                            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                        />

                    </div>

                    <select
                        value={entreprise}
                        onChange={(e) =>
                            setEntreprise(e.target.value)
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 sm:w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    >

                        <option value="Toutes">
                            Toutes les entreprises
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

                <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
                    Chargement des employés…
                </div>

            ) : (

                <>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead>

                                    <tr className="border-b border-slate-200">

                                        <th className="text-left px-6 py-3 font-medium text-slate-500">
                                            Nom
                                        </th>

                                        <th className="text-left px-6 py-3 font-medium text-slate-500">
                                            Email
                                        </th>

                                        <th className="text-left px-6 py-3 font-medium text-slate-500 hidden md:table-cell">
                                            Téléphone
                                        </th>

                                        <th className="text-left px-6 py-3 font-medium text-slate-500 hidden lg:table-cell">
                                            Poste
                                        </th>

                                        <th className="text-left px-6 py-3 font-medium text-slate-500">
                                            Entreprise
                                        </th>

                                        <th className="text-right px-6 py-3 font-medium text-slate-500">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {employeesPage.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                Aucun employé ne correspond à ces critères.
                                            </td>

                                        </tr>

                                    ) : (

                                        employeesPage.map((employee) => {

                                            const avatar = getAvatarColors(employee.name);

                                            return (

                                                <tr
                                                    key={employee.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >

                                                    <td className="px-6 py-3.5">

                                                        <div className="flex items-center gap-3">

                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatar.bg} ${avatar.text}`}
                                                            >
                                                                {getInitials(employee.name)}
                                                            </div>

                                                            <span className="font-medium text-slate-800">
                                                                {employee.name}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-3.5 text-slate-600">
                                                        {employee.email}
                                                    </td>

                                                    <td className="px-6 py-3.5 text-slate-600 hidden md:table-cell">
                                                        {employee.telephone_whatsapp ?? "—"}
                                                    </td>

                                                    <td className="px-6 py-3.5 text-slate-600 hidden lg:table-cell">
                                                        {employee.poste?.nom ?? "—"}
                                                    </td>

                                                    <td className="px-6 py-3.5">

                                                        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-medium">
                                                            {employee.entreprise?.nom ?? "—"}
                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-3.5">

                                                        <div className="flex justify-end gap-4">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(employee)
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                            >
                                                                Modifier
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openDeleteConfirm(employee)
                                                                }
                                                                className="text-red-600 hover:text-red-800 font-medium"
                                                            >
                                                                Supprimer
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* PAGINATION */}

                        {totalPages > 1 && (

                            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                    className="text-sm px-3 py-1.5 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                                >
                                    ← Précédent
                                </button>

                                <div className="flex items-center gap-1">

                                    {pageList.map((p, index) =>

                                        p === "…" ? (

                                            <span
                                                key={`ellipsis-${index}`}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm"
                                            >
                                                …
                                            </span>

                                        ) : (

                                            <button
                                                type="button"
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                    page === p
                                                        ? "bg-indigo-600 text-white"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                }`}
                                            >
                                                {p}
                                            </button>

                                        )

                                    )}

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={page === totalPages}
                                    className="text-sm px-3 py-1.5 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                                >
                                    Suivant →
                                </button>

                            </div>

                        )}

                    </div>

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


            {/* MODAL MODIFICATION */}

            <EditEmployeeModal

                isOpen={isEditModalOpen}

                employee={editingEmployee}

                entreprises={entreprises}

                onClose={() =>
                    setIsEditModalOpen(false)
                }

                onSuccess={handleEmployeeUpdated}

            />


            {/* MODAL CONFIRMATION SUPPRESSION */}

            {isDeleteConfirmOpen && (

                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 px-4">

                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">

                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Confirmer la suppression
                        </h3>

                        <p className="text-slate-600 mb-4 text-sm">
                            Voulez-vous vraiment supprimer{" "}
                            <span className="font-medium text-slate-900">
                                {deletingEmployee?.name}
                            </span>{" "}
                            ? Cette action est irréversible.
                        </p>

                        {deleteError && (
                            <p className="text-sm text-red-600 mb-3">
                                {deleteError}
                            </p>
                        )}

                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setIsDeleteConfirmOpen(false)
                                }
                                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? "Suppression…" : "Supprimer"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}