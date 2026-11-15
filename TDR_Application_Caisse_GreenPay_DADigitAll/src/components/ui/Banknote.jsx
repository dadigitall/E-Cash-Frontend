/*
  Billet FCFA dessiné en SVG (aucune image externe).
  Props : value (10000 | 5000 | 2000 | 1000 | 500), className
  Ratio 400x187, adapté à MoneyFlow (w-44 => hauteur ≈ 82px).
*/

const PALETTES = {
  10000: {
    light: "#e6dcf2",
    base: "#9c84c6",
    dark: "#4a3b86",
    accent: "#2f3f9a",
    warm: "#d9a066",
  },
  5000: {
    light: "#dcefe3",
    base: "#7fb596",
    dark: "#2f6a4c",
    accent: "#1f5f7a",
    warm: "#d8b45a",
  },
  2000: {
    light: "#dce9f6",
    base: "#7ea6d3",
    dark: "#2f5a8e",
    accent: "#3b3f95",
    warm: "#e0a35e",
  },
  1000: {
    light: "#f6e6d2",
    base: "#d9a56c",
    dark: "#8a5428",
    accent: "#7a3b2e",
    warm: "#c9605a",
  },
  500: {
    light: "#f5dde0",
    base: "#d58a97",
    dark: "#8a2f45",
    accent: "#5c2f7a",
    warm: "#e0b25e",
  },
};

const MOTS = {
  10000: ["DIX MILLE", "FRANCS CFA"],
  5000: ["CINQ MILLE", "FRANCS CFA"],
  2000: ["DEUX MILLE", "FRANCS CFA"],
  1000: ["MILLE", "FRANCS CFA"],
  500: ["CINQ CENTS", "FRANCS CFA"],
};

const LETTRES = { 10000: "B", 5000: "H", 2000: "D", 1000: "K", 500: "S" };

function formatValeur(v) {
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

export default function Banknote({ value = 10000, className = "" }) {
  const v = PALETTES[value] ? value : 10000;
  const p = PALETTES[v];
  const [mot1, mot2] = MOTS[v];
  const lettre = LETTRES[v];
  const serie = `2301${String(v).padStart(5, "0")}${(v * 7) % 100}`.slice(
    0,
    11,
  );
  const id = `bk${v}`;
  const texte = formatValeur(v);

  return (
    <svg
      viewBox="0 0 400 187"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Billet de ${texte} FCFA`}
      translate="no"
    >
      <defs>
        <linearGradient id={`${id}-fond`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.light} />
          <stop offset="0.45" stopColor={p.base} />
          <stop offset="1" stopColor={p.light} />
        </linearGradient>
        <linearGradient id={`${id}-bande`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor={p.light} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-masque`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.accent} />
          <stop offset="1" stopColor={p.dark} />
        </linearGradient>
        <pattern
          id={`${id}-guil`}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(28)"
        >
          <path
            d="M0 4.5 Q2.25 0 4.5 4.5 T9 4.5"
            fill="none"
            stroke="#fff"
            strokeWidth="0.6"
            opacity="0.28"
          />
          <path
            d="M0 8 Q2.25 3.5 4.5 8 T9 8"
            fill="none"
            stroke={p.dark}
            strokeWidth="0.4"
            opacity="0.16"
          />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <rect width="400" height="187" rx="7" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        {/* Fond */}
        <rect width="400" height="187" fill={`url(#${id}-fond)`} />
        <rect width="400" height="187" fill={`url(#${id}-guil)`} />

        {/* Grands cercles décoratifs */}
        <circle
          cx="300"
          cy="110"
          r="70"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.25"
          strokeWidth="1.2"
        />
        <circle
          cx="300"
          cy="110"
          r="54"
          fill="none"
          stroke={p.dark}
          strokeOpacity="0.15"
          strokeWidth="1"
        />

        {/* Bandeau gauche */}
        <rect x="0" y="0" width="62" height="187" fill={`url(#${id}-bande)`} />
        <ellipse
          cx="31"
          cy="112"
          rx="20"
          ry="30"
          fill={p.base}
          opacity="0.18"
        />
        <line
          x1="62"
          y1="0"
          x2="62"
          y2="187"
          stroke={p.dark}
          strokeOpacity="0.25"
        />

        {/* Valeur en haut à gauche */}
        <text
          x="10"
          y="27"
          fontSize="15"
          fontWeight="800"
          fontFamily="Arial, Helvetica, sans-serif"
          fill="#fff"
          stroke={p.dark}
          strokeWidth="0.6"
          strokeOpacity="0.5"
          paintOrder="stroke"
        >
          {texte}
        </text>

        {/* Texte vertical BCEAO */}
        <g
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="6.2"
          fontWeight="700"
          fill={p.dark}
        >
          <text transform="translate(27 172) rotate(-90)">BANQUE CENTRALE</text>
          <text transform="translate(39 172) rotate(-90)">
            DES ÉTATS DE L'AFRIQUE DE L'OUEST
          </text>
        </g>

        {/* Triangles (motif bas) */}
        <g>
          {Array.from({ length: 9 }).map((_, i) => (
            <polygon
              key={i}
              points={`${78 + i * 17},166 ${86 + i * 17},140 ${94 + i * 17},166`}
              fill={i % 2 ? p.accent : p.dark}
              opacity="0.55"
            />
          ))}
          <rect
            x="78"
            y="166"
            width="150"
            height="3"
            fill={p.dark}
            opacity="0.4"
          />
        </g>

        {/* Masque africain stylisé */}
        <g transform="translate(168 84)">
          <path d="M-34 52 L-18 -2 L0 52 Z" fill={p.accent} opacity="0.35" />
          <path d="M34 52 L18 -2 L0 52 Z" fill={p.dark} opacity="0.3" />
          {/* crête */}
          <path
            d="M-20 -48 L-12 -62 L-6 -48 L0 -66 L6 -48 L12 -62 L20 -48 Z"
            fill={`url(#${id}-masque)`}
          />
          {/* visage */}
          <path
            d="M0 -48 C20 -48 28 -26 22 -2 L12 46 Q0 62 -12 46 L-22 -2 C-28 -26 -20 -48 0 -48 Z"
            fill={`url(#${id}-masque)`}
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          {/* yeux */}
          <path d="M-15 -20 L-5 -16 L-15 -12 Z" fill="#fff" opacity="0.9" />
          <path d="M15 -20 L5 -16 L15 -12 Z" fill="#fff" opacity="0.9" />
          {/* nez et bouche */}
          <rect
            x="-2.5"
            y="-14"
            width="5"
            height="34"
            fill="#fff"
            opacity="0.65"
          />
          <rect
            x="-8"
            y="30"
            width="16"
            height="4"
            fill="#fff"
            opacity="0.75"
          />
          {/* scarifications */}
          <g stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2">
            <line x1="-17" y1="-36" x2="-9" y2="-34" />
            <line x1="17" y1="-36" x2="9" y2="-34" />
            <line x1="-15" y1="2" x2="-8" y2="6" />
            <line x1="15" y1="2" x2="8" y2="6" />
            <line x1="-13" y1="12" x2="-7" y2="16" />
            <line x1="13" y1="12" x2="7" y2="16" />
          </g>
          {/* ornement du front */}
          <circle cx="0" cy="-34" r="3.2" fill={p.warm} />
        </g>

        {/* @ */}
        <g>
          <circle
            cx="302"
            cy="112"
            r="24"
            fill="#fff"
            fillOpacity="0.2"
            stroke={p.dark}
            strokeOpacity="0.45"
            strokeWidth="1.4"
          />
          <text
            x="302"
            y="123"
            fontSize="34"
            textAnchor="middle"
            fontWeight="700"
            fontFamily="Arial, Helvetica, sans-serif"
            fill={p.dark}
            fillOpacity="0.7"
          >
            @
          </text>
        </g>

        {/* Valeur principale */}
        <text
          x="368"
          y="56"
          fontSize="32"
          fontWeight="900"
          textAnchor="end"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fill={p.dark}
          stroke="#fff"
          strokeWidth="1.6"
          strokeOpacity="0.8"
          paintOrder="stroke"
        >
          {texte}
        </text>

        {/* Numéro de série */}
        <text
          x="368"
          y="17"
          fontSize="7.2"
          textAnchor="end"
          fontFamily="Courier New, monospace"
          fill={p.dark}
          fontWeight="700"
        >
          {serie} {lettre}
        </text>
        <text
          x="70"
          y="180"
          fontSize="7.2"
          fontFamily="Courier New, monospace"
          fill={p.dark}
          fontWeight="700"
        >
          {serie} {lettre}
        </text>

        {/* Bande de sécurité (carrés holographiques) */}
        <g>
          {[68, 90, 112, 134].map((y, i) => (
            <g key={y}>
              <rect
                x="374"
                y={y}
                width="16"
                height="16"
                rx="2"
                fill="#fff"
                fillOpacity="0.55"
                stroke={p.dark}
                strokeOpacity="0.5"
              />
              <circle
                cx="382"
                cy={y + 8}
                r="4"
                fill={i % 2 ? p.warm : p.accent}
                opacity="0.75"
              />
            </g>
          ))}
        </g>

        {/* Valeur en lettres */}
        <g
          textAnchor="end"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fill={p.dark}
        >
          <text x="366" y="163" fontSize="8.5">
            {mot1}
          </text>
          <text x="366" y="174" fontSize="8.5">
            {mot2}
          </text>
        </g>

        {/* Reflet */}
        <rect width="400" height="187" fill="#fff" opacity="0.05" />
      </g>

      {/* Bordure */}
      <rect
        x="0.5"
        y="0.5"
        width="399"
        height="186"
        rx="7"
        fill="none"
        stroke={p.dark}
        strokeOpacity="0.55"
      />
      <rect
        x="6"
        y="6"
        width="388"
        height="175"
        rx="4"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.45"
      />
    </svg>
  );
}
