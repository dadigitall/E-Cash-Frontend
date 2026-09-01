import { NavLink } from "react-router-dom";
import menus from "../config/menu";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
    const { auth } = useAuth();

    const menu = menus[auth?.role] || [];

    function estLienRacine(path) {
        return menu.some(
            (autre) =>
                autre.path !== path &&
                autre.path.startsWith(path + "/")
        );
    }

    return (
        <>
            {/* Fond sombre cliquable, uniquement visible sur mobile quand ouvert */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
            )}

            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-50
                    w-64 bg-gray-900 text-white p-6
                    transform transition-transform duration-200 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >

                <div className="flex items-center justify-between mb-2 md:block">

                    <h2 className="text-xl font-bold">
                        {auth?.entreprise === "greenpay"
                            ? "GreenPay"
                            : "DA Digit All"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="md:hidden text-gray-400 hover:text-white text-2xl leading-none"
                    >
                        ×
                    </button>

                </div>

                <p className="text-sm text-gray-400 mb-8">
                    Gestion des caisses
                </p>

                <nav className="space-y-2">

                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={estLienRacine(item.path)}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg transition ${
                                    isActive
                                        ? "bg-green-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}

                </nav>

            </aside>
        </>
    );
}