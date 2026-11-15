import {
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { CompanyLogo } from "../ui/DashboardKit";

const EASE = [0.2, 0.8, 0.2, 1];

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:bg-canvas disabled:text-muted";

export const labelClass = "mb-2 block text-sm font-medium text-ink";

export const primaryBtn =
  "w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const linkClass =
  "font-medium text-brand underline-offset-4 hover:text-brand-deep hover:underline";

/* Variantes d'apparition en cascade (titre, champs, pied de page) */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Alert({ type = "error", children }) {
  const classes =
    type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <motion.div
      role={type === "error" ? "alert" : "status"}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-5 rounded-xl border px-4 py-3 text-sm ${classes}`}
    >
      {children}
    </motion.div>
  );
}

// Utilisable hors AuthShell : sans parent animé, il s'affiche simplement.
export function Field({ label, error, children }) {
  return (
    <motion.div variants={item}>
      {label && <label className={labelClass}>{label}</label>}
      {children}
      {error && (
        <p className="mt-1 text-sm text-rose-600">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Visuel : deux cartes logo en perspective, parallaxe au curseur       */
/* ------------------------------------------------------------------ */
function LogoCard({
  companyKey,
  nom,
  detail,
  className,
  z,
  floatDelay,
  enterDelay,
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ z }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: enterDelay, ease: EASE }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 5.5,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex w-72 items-center gap-4 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5"
      >
        <CompanyLogo companyKey={companyKey} size={76} className="bg-white" />
        <div className="text-[#14202b]">
          <p className="text-lg font-semibold leading-tight">{nom}</p>
          <p className="mt-0.5 text-sm text-slate-500">{detail}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AsideVisual() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 90, damping: 16 };
  const rotateY = useSpring(useTransform(mx, [0, 1], [-26, -6]), spring);
  const rotateX = useSpring(useTransform(my, [0, 1], [14, 2]), spring);

  function onMove(e) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <div
      className="grid place-items-center"
      onPointerMove={onMove}
      style={{ padding: "2rem" }}
    >
      <div
        className="relative h-80 w-full max-w-sm"
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <LogoCard
            companyKey="da"
            nom="DA Digit All"
            detail="Caisse de dépenses"
            className="left-10 top-2"
            z={0}
            floatDelay={0}
            enterDelay={0.25}
          />
          <LogoCard
            companyKey="gp"
            nom="GreenPay"
            detail="Caisse de dépenses"
            className="left-0 top-36"
            z={70}
            floatDelay={1.4}
            enterDelay={0.45}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* Halos lumineux lents en arrière-plan */
function Glows() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-96 rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 size-96 rounded-full bg-accent/25 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/*
  company : "gp" | "da" (optionnel) pour prévisualiser un thème précis,
  par exemple sur l'inscription. Sans valeur, le thème courant est utilisé.
*/
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  company,
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        data-company={company}
        className="grid min-h-screen bg-canvas text-ink transition-colors duration-500 lg:grid-cols-[1.05fr_1fr]"
      >
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-brand-deep to-brand p-12 text-white transition-colors duration-500 lg:flex">
          <Glows />

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-2xl font-bold tracking-tight">E-Cash</p>
            <p className="mt-1 text-white/70">Gestion des caisses</p>
          </motion.div>

          <div className="relative">
            <AsideVisual />
          </div>

          <motion.p
            className="relative max-w-xs text-lg font-medium leading-snug text-white/90"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          >
            Les demandes de dépenses de GreenPay et de DA Digit All, au même
            endroit.
          </motion.p>
        </aside>

        <main className="flex items-center justify-center px-5 py-10">
          <motion.div
            className="w-full max-w-md"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={item}
              className="mb-8 flex items-center gap-3 lg:hidden"
            >
              <CompanyLogo companyKey="gp" size={44} />
              <CompanyLogo companyKey="da" size={44} />
              <p className="text-xl font-bold text-brand">E-Cash</p>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-3xl font-bold tracking-tight"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p variants={item} className="mb-8 mt-2 text-muted">
                {subtitle}
              </motion.p>
            )}

            {children}

            {footer && (
              <motion.div
                variants={item}
                className="mt-6 text-center text-sm text-muted"
              >
                {footer}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
}
