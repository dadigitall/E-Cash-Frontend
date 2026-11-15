import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Coins,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../theme/CompanyThemeProvider";
import { COMPANIES } from "../../theme/companies";
import { CompanyLogo } from "../ui/DashboardKit";
import { MENUS, menuKey } from "./nav.config";

const EASE = [0.2, 0.8, 0.2, 1];

/* ------------------------------------------------------------------ */
/* Menu latéral                                                        */
/* ------------------------------------------------------------------ */
function SidebarContent({ menu, companyKey, groupId, onNavigate, onClose }) {
  const entreprise = COMPANIES[companyKey];

  return (
    <div className="flex h-full flex-col bg-side text-side-ink">
      {/* Marque */}
      <div className="px-6 pb-5 pt-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-side-active text-side-active-ink shadow-lg shadow-black/10">
              <Coins size={22} />
            </span>
            <div>
              <p className="text-xl font-bold leading-none tracking-tight text-side-title">
                E-Cash
              </p>
              <p className="mt-1 text-xs opacity-70">Gestion des caisses</p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              className="grid size-9 place-items-center rounded-xl transition hover:bg-current/10 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Entreprise(s) */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-current/5 p-3">
          {entreprise ? (
            <>
              <CompanyLogo companyKey={companyKey} size={38} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-side-title">
                  {entreprise.nom}
                </p>
                <p className="text-xs opacity-70">Caisse de dépenses</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex -space-x-2">
                <CompanyLogo
                  companyKey="gp"
                  size={36}
                  className="outline-2 outline-side"
                />
                <CompanyLogo
                  companyKey="da"
                  size={36}
                  className="outline-2 outline-side"
                />
              </div>
              <p className="text-sm font-semibold leading-tight text-side-title">
                GreenPay
                <br />
                DA Digit All
              </p>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Navigation principale"
        className="flex-1 overflow-y-auto px-4 pb-6"
      >
        <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-50">
          Menu
        </p>

        <LayoutGroup id={groupId}>
          <ul className="space-y-1">
            {menu.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.04,
                    duration: 0.4,
                    ease: EASE,
                  }}
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                        isActive ? "text-side-active-ink" : "hover:bg-current/5"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-xl bg-side-active shadow-md shadow-black/10"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 32,
                            }}
                          />
                        )}
                        <Icon size={19} className="relative" />
                        <span className="relative">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Menu utilisateur                                                    */
/* ------------------------------------------------------------------ */
function UserMenu({ user, sousTitre, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const nomComplet =
    user?.name ?? user?.nom ?? user?.full_name ?? user?.prenom ?? "";
  const prenom = nomComplet.trim().split(/\s+/)[0] || "Utilisateur";
  const initiale = prenom[0]?.toUpperCase() ?? "?";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-2xl py-1.5 pl-1.5 pr-3 transition hover:bg-brand-soft"
      >
        <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-brand to-brand-deep font-semibold text-white shadow-md shadow-brand/25">
          {initiale}
        </span>

        <span className="hidden text-left sm:block">
          <span className="block max-w-44 truncate text-sm font-semibold leading-tight text-ink">
            {prenom}
          </span>
          {sousTitre && (
            <span className="block max-w-44 truncate text-xs text-muted">
              {sousTitre}
            </span>
          )}
        </span>

        <ChevronDown
          size={16}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute right-0 z-30 mt-2 w-64 origin-top-right rounded-2xl bg-surface p-2 shadow-2xl ring-1 ring-black/5"
          >
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-ink">
                {nomComplet}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-muted">{user.email}</p>
              )}
            </div>

            <div className="my-1 h-px bg-line" />

            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut size={17} />
              Se déconnecter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
export default function AppLayout({ children }) {
  const { user: auth, logout } = useAuth();
  // Selon AuthContext, l'utilisateur est soit auth, soit auth.user
  const user = auth?.user ?? auth?.data?.user ?? auth;
  const { key: companyKey } = useCompany();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // menuKey reçoit l'objet complet pour trouver le rôle
  const menu = MENUS[menuKey(auth)];

  // Page courante (route la plus précise)
  const courante = [...menu]
    .sort((a, b) => b.to.length - a.to.length)
    .find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  // Page autorisée pour ce rôle ? Sinon retour au dashboard
  const autorise = menu.some(
    (i) => pathname === i.to || pathname.startsWith(`${i.to}/`),
  );

  useEffect(() => {
    if (!autorise) navigate("/dashboard", { replace: true });
  }, [autorise, navigate]);

  // Sous-titre de l'utilisateur : son entreprise, sinon son email
  const e = user?.entreprise;
  const nomEntreprise =
    typeof e === "string" ? e : (e?.nom ?? user?.entreprise_nom);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (ev) => ev.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  function handleLogout() {
    logout?.();
    navigate("/", { replace: true });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh overflow-hidden bg-canvas text-ink">
        {/* Menu fixe (grand écran) */}
        <aside className="hidden w-72 shrink-0 border-r border-black/5 lg:block">
          <SidebarContent
            menu={menu}
            companyKey={companyKey}
            groupId="desktop"
          />
        </aside>

        {/* Menu tiroir (mobile) */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="overlay"
                className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
              />
              <motion.aside
                key="drawer"
                className="fixed inset-y-0 left-0 z-40 w-72 shadow-2xl lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 34 }}
              >
                <SidebarContent
                  menu={menu}
                  companyKey={companyKey}
                  groupId="mobile"
                  onNavigate={() => setDrawerOpen(false)}
                  onClose={() => setDrawerOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Colonne principale */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line bg-surface/80 px-4 backdrop-blur-md sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Ouvrir le menu"
                className="grid size-10 place-items-center rounded-xl text-ink transition hover:bg-brand-soft lg:hidden"
              >
                <Menu size={22} />
              </button>

              <nav
                aria-label="Fil d'Ariane"
                className="flex min-w-0 items-center gap-2 text-sm"
              >
                <span className="text-muted">E-Cash</span>
                <ChevronRight size={15} className="shrink-0 text-muted/60" />
                <span className="truncate font-semibold text-ink">
                  {courante?.label ?? "Tableau de bord"}
                </span>
              </nav>
            </div>

            <UserMenu
              user={user}
              sousTitre={nomEntreprise ?? user?.email}
              onLogout={handleLogout}
            />
          </header>

          <main className="flex-1 overflow-y-auto">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8"
            >
              {autorise ? (children ?? <Outlet />) : null}
            </motion.div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
