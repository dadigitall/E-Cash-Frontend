import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import daLogo from "../../assets/logos/da-digit-all.png";
import gpEmblem from "../../assets/logos/greenpay-emblem.png";

export const fcfa = (n) =>
  new Intl.NumberFormat("fr-FR")
    .format(Math.round(Number(n) || 0))
    .replace(/\u202f/g, "\u00a0");

const EASE = [0.2, 0.8, 0.2, 1];

/* ------------------------------------------------------------------ */
/* Logos                                                               */
/* ------------------------------------------------------------------ */
const LOGOS = {
  da: { src: daLogo, alt: "DA Digit All" },
  gp: { src: gpEmblem, alt: "GreenPay" },
};

// Puce blanche arrondie qui contient le logo (les fichiers ont un fond blanc)
export function CompanyLogo({ companyKey, size = 44, className = "" }) {
  const logo = LOGOS[companyKey];
  if (!logo) return null;

  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logo.src}
        alt={logo.alt}
        className="h-full w-full object-contain p-1"
        draggable={false}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Apparition douce (désactivée si l'utilisateur réduit les animations) */
/* ------------------------------------------------------------------ */
export function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
function useCountUp(target, reduce) {
  const [v, setV] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setV(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: setV,
    });
    return () => controls.stop();
  }, [target, reduce]);

  return v;
}

// Inclinaison 3D qui suit le curseur + reflet lumineux
function useTilt(maxX = 6, maxY = 7) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18 };

  const rotateY = useSpring(useTransform(mx, [0, 1], [-maxY, maxY]), spring);
  const rotateX = useSpring(useTransform(my, [0, 1], [maxX, -maxX]), spring);
  const px = useTransform(mx, (v) => v * 100);
  const py = useTransform(my, (v) => v * 100);
  const sheen = useMotionTemplate`radial-gradient(280px circle at ${px}% ${py}%, rgba(255,255,255,0.22), transparent 60%)`;

  const handlers = {
    onPointerMove(e) {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    },
    onPointerLeave() {
      mx.set(0.5);
      my.set(0.5);
    },
  };

  return { reduce, rotateX, rotateY, sheen, handlers };
}

/* ------------------------------------------------------------------ */
/* Carte de solde (manager, superviseur uniquement)                    */
/* ------------------------------------------------------------------ */
export function BalanceCard({
  label = "Solde de la caisse",
  value,
  companyKey,
  ratio,
  ratioLabel,
}) {
  const { reduce, rotateX, rotateY, sheen, handlers } = useTilt();
  const shown = useCountUp(Number(value) || 0, reduce);
  const pct = ratio == null ? null : Math.max(0, Math.min(100, ratio));

  return (
    <div style={{ perspective: 900 }} data-company={companyKey}>
      <motion.div
        {...handlers}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex min-h-[172px] flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-brand to-brand-deep p-6 text-white shadow-[0_24px_40px_-24px_var(--glow)]"
      >
        <motion.div
          aria-hidden
          style={{ backgroundImage: sheen }}
          className="pointer-events-none absolute inset-0"
        />

        <div className="relative flex items-center justify-between gap-3">
          <span className="text-[15px] opacity-85">{label}</span>
          {companyKey && <CompanyLogo companyKey={companyKey} size={40} />}
        </div>

        <div
          className="relative flex items-baseline gap-2"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* translate="no" : le navigateur ne touche pas au nombre animé */}
          <span
            className="text-4xl font-bold tracking-tight tabular-nums"
            translate="no"
          >
            {String(fcfa(shown))}
          </span>
          <small className="text-[15px] font-semibold opacity-80">FCFA</small>
        </div>

        {pct != null && (
          <div className="relative" style={{ transform: "translateZ(18px)" }}>
            <div className="h-[7px] overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: reduce ? `${pct}%` : 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            </div>
            {ratioLabel && (
              <p className="mt-2 text-[12.5px] opacity-85">{ratioLabel}</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bannière d'accueil de l'employé : aux couleurs de son entreprise    */
/* ------------------------------------------------------------------ */
export function HeroBanner({ title, subtitle, companyKey, children }) {
  const { rotateX, rotateY, sheen, handlers } = useTilt(3, 3.5);

  return (
    <div style={{ perspective: 1100 }}>
      <motion.div
        {...handlers}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand to-brand-deep p-6 text-white shadow-[0_24px_40px_-26px_var(--glow)] sm:p-8"
      >
        <motion.div
          aria-hidden
          style={{ backgroundImage: sheen }}
          className="pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
        />

        <div
          className="relative flex flex-wrap items-center justify-between gap-5"
          style={{ transform: "translateZ(24px)" }}
        >
          <div className="flex items-center gap-4">
            {companyKey && <CompanyLogo companyKey={companyKey} size={56} />}
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle && <p className="mt-0.5 text-white/80">{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function StatCard({ label, value, unit, icon: Icon }) {
  const reduce = useReducedMotion();
  const isNumber = typeof value === "number";
  const shown = useCountUp(isNumber ? value : 0, reduce);

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col justify-between gap-3 rounded-3xl border border-line bg-surface p-5"
    >
      <span className="flex items-center gap-2 text-[15px] text-muted">
        {Icon && (
          <span className="grid size-8 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon size={17} />
          </span>
        )}
        <span>{label}</span>
      </span>
      <div className="flex items-baseline gap-2 text-3xl font-bold tracking-tight text-ink tabular-nums">
        {/* Un seul span stable pour le nombre animé */}
        <span translate="no">
          {String(isNumber ? (unit === "FCFA" ? fcfa(shown) : shown) : value)}
        </span>
        {unit && (
          <small className="text-sm font-semibold text-muted">{unit}</small>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
const STATUTS = {
  en_attente: ["En attente", "bg-amber-100 text-amber-800"],
  acceptee: ["Acceptée", "bg-brand-soft text-brand-deep"],
  preuve_envoyee: ["Preuve envoyée", "bg-sky-100 text-sky-800"],
  terminee: ["Terminée", "bg-emerald-100 text-emerald-800"],
  rejetee: ["Rejetée", "bg-rose-100 text-rose-800"],
};

export function StatusBadge({ statut }) {
  const [label, classes] = STATUTS[statut] ?? [
    String(statut ?? "").replace(/_/g, " "),
    "bg-slate-100 text-slate-700",
  ];
  return (
    <span
      className={`inline-block min-w-24 rounded-full px-3.5 py-1.5 text-center text-[13px] font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
export function Pagination({ current, last, total, onChange }) {
  if (last <= 1) return null;

  const base =
    "grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className="pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Page précédente"
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className={`${base} border border-line bg-surface text-ink hover:bg-brand-soft`}
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: last }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === current ? "page" : undefined}
            onClick={() => onChange(page)}
            className={`${base} ${
              page === current
                ? "bg-brand font-semibold text-white"
                : "border border-line bg-surface text-ink hover:bg-brand-soft"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          aria-label="Page suivante"
          disabled={current === last}
          onClick={() => onChange(current + 1)}
          className={`${base} border border-line bg-surface text-ink hover:bg-brand-soft`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {total > 0 && (
        <p className="pt-2 text-center text-sm text-muted">
          {`Page ${current} sur ${last}`}
        </p>
      )}
    </nav>
  );
}
