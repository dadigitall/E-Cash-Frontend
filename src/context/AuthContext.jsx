import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [auth, setAuth] = useState({
        user: JSON.parse(localStorage.getItem("user")),
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        entreprise: localStorage.getItem("entreprise"),
    });

    function login(data) {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.role);
        localStorage.setItem("entreprise", data.entreprise);

        setAuth({
            user: data.user,
            token: data.token,
            role: data.role,
            entreprise: data.entreprise,
        });

    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("entreprise");

        setAuth({
            user: null,
            token: null,
            role: null,
            entreprise: null,
        });

    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}