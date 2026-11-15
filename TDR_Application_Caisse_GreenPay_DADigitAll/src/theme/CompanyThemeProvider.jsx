import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";
import { COMPANIES, resolveCompany } from "./companies";

const CompanyContext = createContext({
  key: "neutral",
  company: null,
  setForced: () => {},
});

// À placer DANS <AuthProvider> (il lit useAuth().user).
export function CompanyThemeProvider({ children }) {
  const { user } = useAuth();
  const [forced, setForced] = useState(null);

  // "forced" permet à une page (manager, superviseur) d'imposer le thème neutre
  const key = forced ?? resolveCompany(user);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.company = key;
    return () => {
      delete root.dataset.company;
    };
  }, [key]);

  const value = useMemo(
    () => ({ key, company: COMPANIES[key] ?? null, setForced }),
    [key],
  );

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export const useCompany = () => useContext(CompanyContext);

// À appeler dans les pages qui voient les deux entreprises.
export function useForceNeutralTheme() {
  const { setForced } = useContext(CompanyContext);

  useLayoutEffect(() => {
    setForced("neutral");
    return () => setForced(null);
  }, [setForced]);
}
