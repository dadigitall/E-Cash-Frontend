import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import Banknote from "./Banknote";
import { fcfa } from "./DashboardKit";

/* ------------------------------------------------------------------ */
/* Coupures FCFA qui composent le montant                              */
/* ------------------------------------------------------------------ */
const COUPURES = [10000, 5000, 2000, 1000, 500];
const DECOUPE = {
  10000: [5000, 5000],
  5000: [2000, 2000, 1000],
  2000: [1000, 1000],
  1000: [500, 500],
};
const BILLETS_GENERIQUES = [10000, 5000, 10000, 2000, 5000, 1000, 10000, 5000];

function billetsPour(montant, max = 12, minimum = 6) {
  let reste = Math.max(0, Math.round(Number(montant) || 0));
  if (reste === 0) return BILLETS_GENERIQUES;

  const billets = [];
  for (const c of COUPURES) {
    while (reste >= c && billets.length < max) {
      billets.push(c);
      reste -= c;
    }
  }
  if (billets.length === 0) billets.push(500);

  // Peu de billets : on découpe les plus gros pour un rendu plus visible,
  // sans changer le total.
  while (billets.length < minimum) {
    const i = billets.findIndex(
      (b) => b === Math.max(...billets) && DECOUPE[b],
    );
    if (i === -1) break;
    billets.splice(i, 1, ...DECOUPE[billets[i]]);
  }
  return billets;
}

/* ------------------------------------------------------------------ */
/* Trajectoires (aléatoire reproductible : même id => même animation)  */
/* ------------------------------------------------------------------ */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TIMES = [0, 0.15, 0.8, 1];

function trajectoires(billets, direction, anchor, seed) {
  const rand = mulberry32(Number(seed) || 1);
  const vw = (n) => `${n}vw`;
  const vh = (n) => `${n}vh`;

  return billets.map((valeur, i) => {
    const delay = i * 0.1 + rand() * 0.08;
    const duration = 1.7 + rand() * 0.5;
    const signe = rand() > 0.5 ? 1 : -1;

    if (direction === "in") {
      const x0 = anchor.x + (rand() - 0.5) * 70;
      const xm = x0 + (rand() - 0.5) * 16;
      const xf = anchor.x + (rand() - 0.5) * 6;
      const y0 = -(20 + rand() * 25);
      const ym = anchor.y * 0.45;

      return {
        valeur,
        delay,
        duration,
        x: [vw(x0), vw(xm), vw(xf), vw(xf)],
        y: [vh(y0), vh(ym), vh(anchor.y), vh(anchor.y)],
        rotateZ: [
          signe * (20 + rand() * 50),
          signe * 15,
          (rand() - 0.5) * 12,
          0,
        ],
        rotateX: [60 + rand() * 40, 25, 0, 0],
        rotateY: [(rand() - 0.5) * 120, (rand() - 0.5) * 40, 0, 0],
        scale: [0.9, 1, 1, 0.5],
        opacity: [0, 1, 1, 0],
      };
    }

    // "out" : les billets partent vers le haut à droite
    const xa = anchor.x + (rand() - 0.5) * 8;
    return {
      valeur,
      delay,
      duration,
      x: [vw(xa), vw(xa + 6 + rand() * 8), vw(105 + rand() * 12), vw(115)],
      y: [
        vh(anchor.y),
        vh(anchor.y - (6 + rand() * 8)),
        vh(-(22 + rand() * 18)),
        vh(-45),
      ],
      rotateZ: [
        (rand() - 0.5) * 20,
        signe * (15 + rand() * 30),
        signe * (50 + rand() * 80),
        signe * 90,
      ],
      rotateX: [0, 25, 70, 80],
      rotateY: [0, (rand() - 0.5) * 60, (rand() - 0.5) * 140, 0],
      scale: [0.6, 1, 0.85, 0.7],
      opacity: [0, 1, 1, 0],
    };
  });
}

/* ------------------------------------------------------------------ */
/*
  event  : { id, direction: "in" | "out", amount, label } ou null
  anchor : point de convergence / départ, en % de l'écran
  onDone : appelé à la fin de l'animation
*/
export default function MoneyFlow({
  event,
  onDone,
  anchor = { x: 50, y: 30 },
}) {
  const reduce = useReducedMotion();
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  const plan = useMemo(() => {
    if (!event) return null;

    const billets = billetsPour(event.amount);
    const vols = reduce
      ? []
      : trajectoires(billets, event.direction, anchor, event.id);

    const finBillets = vols.reduce(
      (m, v) => Math.max(m, v.delay + v.duration),
      0,
    );
    const chipDelay = reduce ? 0 : event.direction === "in" ? 0.9 : 0.25;
    const chipDuration = 2.6;

    return {
      vols,
      chipDelay,
      chipDuration,
      total: Math.max(finBillets, chipDelay + chipDuration) + 0.2,
    };
  }, [event, reduce, anchor.x, anchor.y]);

  useEffect(() => {
    if (!plan) return;
    const t = setTimeout(() => doneRef.current?.(), plan.total * 1000);
    return () => clearTimeout(t);
  }, [plan]);

  if (!event || !plan) return null;

  const entrant = event.direction === "in";
  const Icon = entrant ? ArrowDownLeft : ArrowUpRight;
  const montant = Number(event.amount) || 0;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      style={{ perspective: 900 }}
      translate="no"
    >
      {plan.vols.map((v, i) => (
        <motion.div
          key={`${event.id}-${i}`}
          // Mobile : billet de 128 px (centré par -ml-16 / -mt-[30px]).
          // À partir de sm : 176 px (centré par -ml-22 / -mt-[41px]).
          className="absolute left-0 top-0 -ml-16 -mt-[30px] w-32 drop-shadow-xl sm:-ml-22 sm:-mt-[41px] sm:w-44"
          initial={{
            opacity: 0,
            x: v.x[0],
            y: v.y[0],
            rotateZ: v.rotateZ[0],
            rotateX: v.rotateX[0],
            rotateY: v.rotateY[0],
            scale: v.scale[0],
          }}
          animate={{
            opacity: v.opacity,
            x: v.x,
            y: v.y,
            rotateZ: v.rotateZ,
            rotateX: v.rotateX,
            rotateY: v.rotateY,
            scale: v.scale,
          }}
          transition={{
            duration: v.duration,
            delay: v.delay,
            times: TIMES,
            ease: "easeInOut",
          }}
        >
          <Banknote value={v.valeur} className="block h-auto w-full" />
        </motion.div>
      ))}

      {/* Message : montant et libellé */}
      <div
        className="absolute -translate-x-1/2"
        style={{ left: `${anchor.x}vw`, top: `${anchor.y + 12}vh` }}
      >
        <motion.div
          role="status"
          className="flex max-w-[90vw] items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-ink shadow-2xl ring-1 ring-black/5 sm:px-5"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [10, 0, 0, -6],
            scale: [0.9, 1, 1, 0.98],
          }}
          transition={{
            duration: plan.chipDuration,
            delay: plan.chipDelay,
            times: [0, 0.12, 0.85, 1],
            ease: "easeOut",
          }}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
            <Icon size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-muted">{event.label}</span>
            {montant > 0 && (
              <span className="block text-lg font-bold tabular-nums">
                {`${entrant ? "+" : "−"} ${fcfa(montant)} FCFA`}
              </span>
            )}
          </span>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
