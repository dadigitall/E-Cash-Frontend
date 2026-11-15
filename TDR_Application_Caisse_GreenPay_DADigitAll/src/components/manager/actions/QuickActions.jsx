import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeftRight, Wallet } from "lucide-react";

function Action({ icon: Icon, title, text, onClick }) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="group flex flex-1 items-center gap-4 rounded-3xl border border-line bg-surface p-5 text-left transition-colors hover:border-brand/40 hover:bg-brand-soft/40"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        <Icon size={22} />
      </span>
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="block text-sm text-muted">{text}</span>
      </span>
    </motion.button>
  );
}

export default function QuickActions({ onBorrow, onSupply }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-ink">
        Actions rapides
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Action
          icon={ArrowLeftRight}
          title="Emprunt"
          text="Transférer des fonds d'une caisse à l'autre"
          onClick={onBorrow}
        />
        <Action
          icon={Wallet}
          title="Approvisionner une caisse"
          text="Ajouter de l'argent dans une caisse"
          onClick={onSupply}
        />
      </div>
    </section>
  );
}
