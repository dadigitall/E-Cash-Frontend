/* ---------- Tailwind (champs et boutons natifs) ---------- */
export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:bg-canvas disabled:text-muted";

export const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export const primaryBtnClass =
  "rounded-xl bg-brand px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const ghostBtnClass =
  "rounded-xl border border-line bg-surface px-5 py-2.5 font-medium text-ink transition hover:bg-brand-soft";

export const outlineBtnClass =
  "rounded-xl border border-brand px-4 py-2 font-medium text-brand transition hover:bg-brand-soft";

/* ---------- HeroUI (modales, Input, Select, Button) ---------- */
export const heroModal = {
  backdrop: "bg-ink/50 backdrop-blur-sm",
  base: "rounded-3xl bg-surface text-ink",
  header: "border-b border-line text-ink",
  footer: "border-t border-line",
  closeButton: "hover:bg-brand-soft",
};

export const heroInput = {
  label: "text-muted",
  inputWrapper:
    "border-line data-[hover=true]:border-brand group-data-[focus=true]:border-brand",
};

export const heroSelect = {
  label: "text-muted",
  trigger:
    "border-line data-[hover=true]:border-brand data-[open=true]:border-brand data-[focus=true]:border-brand",
  popoverContent: "bg-surface text-ink",
};

export const heroPrimaryBtn =
  "bg-brand font-semibold text-white shadow-lg shadow-brand/25 data-[hover=true]:bg-brand-deep";
