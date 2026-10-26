import type { ServiceSlug } from "@/lib/content";

const C = {
  ink: "#121316",
  ink2: "#1a1c21",
  ink3: "#24272e",
  line: "#2c2f36",
  paper: "#eff1f3",
  mist: "#a3a8b0",
  accent: "#ff5a1f",
  lime: "#c8f04a",
};

/** Looping illustrations, one per service. Pure SVG + CSS, no JS. */
export function ServiceArt({ slug, className = "" }: { slug: ServiceSlug; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={LABELS[slug]}>
      <rect x="0" y="0" width="400" height="300" rx="24" fill={C.ink2} />
      {ART[slug]}
    </svg>
  );
}

const LABELS: Record<ServiceSlug, string> = {
  web: "A browser window assembling its own layout",
  shopify: "Products dropping into a shopping bag",
  wordpress: "Content blocks stacking into a page",
  "web-apps": "A dashboard with live bar charts",
  automation: "A pipeline of connected steps with data moving through",
};

const ART: Record<ServiceSlug, React.ReactNode> = {
  web: (
    <g>
      <rect x="40" y="40" width="320" height="220" rx="14" fill={C.ink} stroke={C.line} />
      <circle cx="62" cy="60" r="5" fill={C.accent} />
      <circle cx="78" cy="60" r="5" fill={C.line} />
      <circle cx="94" cy="60" r="5" fill={C.line} />
      <rect x="120" y="53" width="160" height="14" rx="7" fill={C.ink3} />
      <g className="art-slide" style={{ animationDelay: "0s" }}>
        <rect x="60" y="90" width="150" height="22" rx="6" fill={C.paper} />
      </g>
      <g className="art-slide" style={{ animationDelay: ".25s" }}>
        <rect x="60" y="120" width="110" height="10" rx="5" fill={C.mist} />
        <rect x="60" y="136" width="130" height="10" rx="5" fill={C.mist} opacity=".6" />
      </g>
      <g className="art-slide" style={{ animationDelay: ".5s" }}>
        <rect x="60" y="162" width="76" height="26" rx="13" fill={C.accent} />
      </g>
      <g className="art-slide" style={{ animationDelay: ".75s" }}>
        <rect x="230" y="90" width="110" height="98" rx="10" fill={C.ink3} />
        <path d="M262 160 L280 132 L300 150 L312 140 L326 160 Z" fill={C.line} />
        <circle cx="305" cy="114" r="8" fill={C.lime} />
      </g>
      <g className="art-slide" style={{ animationDelay: "1s" }}>
        <rect x="60" y="206" width="85" height="36" rx="8" fill={C.ink3} />
        <rect x="157" y="206" width="85" height="36" rx="8" fill={C.ink3} />
        <rect x="254" y="206" width="85" height="36" rx="8" fill={C.ink3} />
      </g>
    </g>
  ),
  shopify: (
    <g>
      <g className="art-drop" style={{ animationDelay: "0s" }}>
        <rect x="150" y="62" width="34" height="34" rx="8" fill={C.accent} />
      </g>
      <g className="art-drop" style={{ animationDelay: ".4s" }}>
        <circle cx="205" cy="74" r="17" fill={C.lime} />
      </g>
      <g className="art-drop" style={{ animationDelay: ".8s" }}>
        <rect x="226" y="58" width="30" height="40" rx="6" fill={C.paper} />
      </g>
      <path d="M128 128 H272 L258 250 H142 Z" fill={C.ink} stroke={C.line} strokeWidth="2" />
      <path d="M170 128 C170 96, 230 96, 230 128" fill="none" stroke={C.mist} strokeWidth="6" strokeLinecap="round" />
      <path d="M128 128 H272" stroke={C.paper} strokeWidth="3" />
      <circle cx="292" cy="120" r="18" fill={C.accent} className="art-pulse" />
      <text x="292" y="126" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="15" fill={C.ink}>
        3
      </text>
      <rect x="160" y="180" width="80" height="10" rx="5" fill={C.line} />
      <rect x="175" y="200" width="50" height="10" rx="5" fill={C.line} />
    </g>
  ),
  wordpress: (
    <g>
      <rect x="90" y="40" width="220" height="220" rx="14" fill={C.ink} stroke={C.line} />
      <g className="art-stack" style={{ animationDelay: "0s" }}>
        <rect x="110" y="62" width="180" height="34" rx="6" fill={C.paper} />
        <rect x="122" y="74" width="90" height="10" rx="5" fill={C.ink} />
      </g>
      <g className="art-stack" style={{ animationDelay: ".3s" }}>
        <rect x="110" y="104" width="86" height="70" rx="6" fill={C.ink3} />
        <path d="M120 162 L140 136 L160 152 L172 142 L186 162 Z" fill={C.line} />
        <rect x="204" y="104" width="86" height="12" rx="6" fill={C.mist} />
        <rect x="204" y="124" width="70" height="12" rx="6" fill={C.mist} opacity=".6" />
        <rect x="204" y="144" width="80" height="12" rx="6" fill={C.mist} opacity=".4" />
      </g>
      <g className="art-stack" style={{ animationDelay: ".6s" }}>
        <rect x="110" y="182" width="180" height="26" rx="6" fill={C.ink3} />
        <rect x="120" y="190" width="40" height="10" rx="5" fill={C.accent} />
      </g>
      <g className="art-stack" style={{ animationDelay: ".9s" }}>
        <rect x="110" y="216" width="180" height="26" rx="6" fill={C.ink3} stroke={C.accent} strokeDasharray="4 4" />
        <text x="200" y="233" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={C.accent}>
          + block
        </text>
      </g>
    </g>
  ),
  "web-apps": (
    <g>
      <rect x="30" y="36" width="340" height="228" rx="14" fill={C.ink} stroke={C.line} />
      <rect x="30" y="36" width="70" height="228" rx="14" fill={C.ink3} />
      <rect x="46" y="60" width="38" height="8" rx="4" fill={C.accent} />
      <rect x="46" y="82" width="38" height="8" rx="4" fill={C.line} />
      <rect x="46" y="104" width="38" height="8" rx="4" fill={C.line} />
      <rect x="46" y="126" width="38" height="8" rx="4" fill={C.line} />
      <rect x="118" y="56" width="70" height="40" rx="8" fill={C.ink3} />
      <rect x="196" y="56" width="70" height="40" rx="8" fill={C.ink3} />
      <rect x="274" y="56" width="78" height="40" rx="8" fill={C.ink3} />
      <rect x="128" y="68" width="30" height="8" rx="4" fill={C.mist} />
      <rect x="206" y="68" width="40" height="8" rx="4" fill={C.mist} />
      <rect x="284" y="68" width="34" height="8" rx="4" fill={C.lime} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          className="art-grow"
          style={{ animationDelay: `${i * 0.18}s` }}
          x={124 + i * 28}
          y={120}
          width="16"
          height="120"
          rx="4"
          fill={i === 5 ? C.accent : C.line}
        />
      ))}
    </g>
  ),
  automation: (
    <g>
      <path id="flow" d="M70 150 C 130 60, 170 60, 200 150 S 280 240, 330 150" fill="none" stroke={C.line} strokeWidth="3" />
      <path d="M70 150 C 130 60, 170 60, 200 150 S 280 240, 330 150" fill="none" stroke={C.accent} strokeWidth="3" className="art-dash" />
      {[
        [70, 150, C.paper],
        [200, 150, C.accent],
        [330, 150, C.lime],
      ].map(([x, y, fill], i) => (
        <g key={i}>
          <rect x={(x as number) - 26} y={(y as number) - 26} width="52" height="52" rx="14" fill={C.ink} stroke={C.line} strokeWidth="2" />
          <circle cx={x as number} cy={y as number} r="9" fill={fill as string} className={i === 1 ? "art-pulse" : undefined} />
        </g>
      ))}
      <circle r="6" fill={C.accent}>
        <animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto">
          <mpath href="#flow" />
        </animateMotion>
      </circle>
      <circle r="4" fill={C.paper}>
        <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite">
          <mpath href="#flow" />
        </animateMotion>
      </circle>
      <text x="70" y="206" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={C.mist}>
        trigger
      </text>
      <text x="200" y="206" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={C.mist}>
        do the thing
      </text>
      <text x="330" y="206" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={C.mist}>
        done ✓
      </text>
    </g>
  ),
};
