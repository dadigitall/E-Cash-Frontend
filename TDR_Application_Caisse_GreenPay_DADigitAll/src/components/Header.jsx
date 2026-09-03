import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {

  const [open, setOpen] = useState(false);

  const { auth, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout(){

      logout();

      navigate("/");

  }

  return (
    <header className="relative z-20 flex justify-between items-center bg-white shadow px-4 md:px-6 py-4">

      {/* Partie gauche */}
      <div className="flex items-center gap-3">

        <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden text-gray-600 hover:text-gray-900"
        >
            <Menu size={24} />
        </button>

        <h1 className="text-lg md:text-xl font-semibold truncate">
          E-Cash
        </h1>

      </div>

      {/* Partie droite */}
      <div className="relative">

        <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 md:gap-3 hover:bg-gray-100 px-2 md:px-3 py-2 rounded-lg"
        >

            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">

                {auth.user?.name?.charAt(0).toUpperCase()}

            </div>

            <div className="text-left hidden sm:block">

                <p className="font-medium">

                    {auth.user?.name}

                </p>

                <p className="text-xs text-gray-500">

                    {auth.entreprise}

                </p>

            </div>

            <span className="hidden sm:inline">▼</span>

        </button>

        {open && (

        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">

            <div className="px-4 py-3 border-b">

                <p className="font-semibold">

                    {auth.user?.name}

                </p>

                <p className="text-sm text-gray-500">

                    {auth.role}

                </p>

                <p className="text-xs text-gray-400">

                    {auth.entreprise}

                </p>

            </div>

            <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
                👤 Mon profil
            </button>

            <hr />

            <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
            >
                🚪 Déconnexion
            </button>

        </div>

        )}

      </div>

    </header>
  );
}