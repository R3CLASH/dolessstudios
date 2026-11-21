import type { SolutionSlug } from "@/lib/content";

const C = {
  ink: "#121316",
  ink2: "#1a1c21",
  ink3: "#24272e",
  line: "#2c2f36",
  paper: "#eff1f3",
  mist: "#a3a8b0",
  accent: "#ff5a1f",
  lime: "#c8f04a",
  violet: "#7b6cf6",
  teal: "#2fb5a0",
  sand: "#f2b544",
  leaf: "#3f8f5c",
};

/**
 * Stand-in illustrations, one per off-the-shelf solution, until real demo
 * screenshots exist. Pure SVG + CSS classes from globals.css — no SMIL, so the
 * global prefers-reduced-motion kill switch stops them.
 */
export function SolutionArt({ slug, className = "" }: { slug: SolutionSlug; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={LABELS[slug]}>
      <rect x="0" y="0" width="400" height="300" rx="24" fill={C.ink2} />
      {ART[slug]}
    </svg>
  );
}

const LABELS: Record<SolutionSlug, string> = {
  trades: "A phone ringing with a quote request flying out of it",
  restaurant: "A menu board filling in beside a reserved table",
  clinic: "An appointment calendar with one slot being taken",
  stay: "A room card with its rate, beside a date range being picked",
  classes: "A weekly timetable filling in above a row of teachers",
  supplier: "A spec sheet with certification seals stamping onto it",
};

const ART: Record<SolutionSlug, React.ReactNode> = {
  // A ringing phone on the left, quote cards flying out to the right.
  trades: (
    <g>
      <rect x="40" y="46" width="120" height="208" rx="18" fill={C.ink} stroke={C.line} />
      <rect x="54" y="66" width="92" height="168" rx="10" fill={C.ink3} />
      <circle cx="100" cy="46" r="0" fill="none" />
      <g className="art-pulse">
        <circle cx="100" cy="112" r="26" fill={C.accent} opacity=".22" />
      </g>
      <path
        d="M90 100c0-3 2-5 5-5h5c3 0 5 2 6 5l2 7c0 3-1 5-3 6l-4 2c3 6 7 10 13 13l2-4c1-2 4-3 6-3l7 2c3 1 5 3 5 6v5c0 3-2 5-5 5-21-1-39-19-39-39Z"
        fill={C.accent}
      />
      <rect x="66" y="178" width="68" height="8" rx="4" fill={C.line} />
      <rect x="66" y="194" width="48" height="8" rx="4" fill={C.line} />
      <text x="100" y="252" fill={C.mist} fontSize="13" fontFamily="monospace" textAnchor="middle">
        ring
      </text>

      <g className="art-slide" style={{ animationDelay: "0s" }}>
        <rect x="190" y="62" width="170" height="52" rx="10" fill={C.ink} stroke={C.line} />
        <rect x="204" y="76" width="84" height="9" rx="4.5" fill={C.paper} />
        <rect x="204" y="92" width="120" height="8" rx="4" fill={C.mist} opacity=".55" />
        <circle cx="344" cy="88" r="7" fill={C.lime} />
      </g>
      <g className="art-slide" style={{ animationDelay: ".4s" }}>
        <rect x="190" y="124" width="170" height="52" rx="10" fill={C.ink} stroke={C.line} />
        <rect x="204" y="138" width="100" height="9" rx="4.5" fill={C.paper} />
        <rect x="204" y="154" width="72" height="8" rx="4" fill={C.mist} opacity=".55" />
        <circle cx="344" cy="150" r="7" fill={C.lime} />
      </g>
      <g className="art-slide" style={{ animationDelay: ".8s" }}>
        <rect x="190" y="186" width="170" height="52" rx="10" fill={C.ink} stroke={C.line} />
        <rect x="204" y="200" width="68" height="9" rx="4.5" fill={C.paper} />
        <rect x="204" y="216" width="110" height="8" rx="4" fill={C.mist} opacity=".55" />
        <circle cx="344" cy="212" r="7" fill={C.lime} />
      </g>
    </g>
  ),

  // A menu board whose lines stack in, next to a table with a reservation chip.
  restaurant: (
    <g>
      <rect x="34" y="40" width="190" height="220" rx="14" fill={C.ink} stroke={C.line} />
      <rect x="56" y="62" width="88" height="16" rx="8" fill={C.lime} />
      {[
        { y: 98, w: 112, d: "0s" },
        { y: 126, w: 86, d: ".3s" },
        { y: 154, w: 128, d: ".6s" },
        { y: 182, w: 74, d: ".9s" },
        { y: 210, w: 104, d: "1.2s" },
      ].map((r) => (
        <g key={r.y} className="art-stack" style={{ animationDelay: r.d }}>
          <rect x="56" y={r.y} width={r.w} height="9" rx="4.5" fill={C.mist} opacity=".7" />
          <rect x="176" y={r.y} width="26" height="9" rx="4.5" fill={C.lime} opacity=".85" />
        </g>
      ))}

      <circle cx="306" cy="128" r="54" fill={C.ink3} />
      <circle cx="306" cy="128" r="34" fill={C.ink} stroke={C.line} />
      <rect x="252" y="124" width="14" height="8" rx="4" fill={C.line} />
      <rect x="346" y="124" width="14" height="8" rx="4" fill={C.line} />
      <g className="art-pulse">
        <circle cx="306" cy="128" r="12" fill={C.lime} />
      </g>
      <rect x="250" y="206" width="112" height="34" rx="17" fill={C.ink} stroke={C.line} />
      <circle cx="270" cy="223" r="6" fill={C.lime} />
      <rect x="284" y="219" width="62" height="8" rx="4" fill={C.mist} opacity=".8" />
      <text x="306" y="268" fill={C.mist} fontSize="12" fontFamily="monospace" textAnchor="middle">
        open now
      </text>
    </g>
  ),

  // A month grid where one slot is claimed, with a request card sliding in.
  clinic: (
    <g>
      <rect x="34" y="40" width="200" height="220" rx="14" fill={C.ink} stroke={C.line} />
      <rect x="56" y="60" width="74" height="12" rx="6" fill={C.paper} />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => {
          const taken = row === 2 && col === 3;
          return (
            <rect
              key={`${row}-${col}`}
              x={56 + col * 32}
              y={94 + row * 36}
              width="24"
              height="26"
              rx="6"
              fill={taken ? C.teal : C.ink3}
              className={taken ? "art-pulse" : undefined}
            />
          );
        }),
      )}

      <g className="art-slide">
        <rect x="252" y="76" width="116" height="148" rx="12" fill={C.ink} stroke={C.line} />
        <rect x="268" y="94" width="56" height="10" rx="5" fill={C.paper} />
        <rect x="268" y="118" width="84" height="8" rx="4" fill={C.ink3} />
        <rect x="268" y="136" width="84" height="8" rx="4" fill={C.ink3} />
        <rect x="268" y="154" width="84" height="8" rx="4" fill={C.ink3} />
        <rect x="268" y="178" width="60" height="26" rx="13" fill={C.teal} />
      </g>
      <text x="200" y="278" fill={C.mist} fontSize="12" fontFamily="monospace" textAnchor="middle">
        requested · confirmed
      </text>
    </g>
  ),

  // A room card with its nightly rate, beside a date range being chosen.
  stay: (
    <g>
      <rect x="34" y="42" width="178" height="216" rx="14" fill={C.ink} stroke={C.line} />
      {/* Stand-in for the room photograph. */}
      <rect x="34" y="42" width="178" height="104" rx="14" fill={C.ink3} />
      <circle cx="78" cy="78" r="11" fill={C.sand} opacity=".8" />
      <path d="M34 146v-26l34-24 30 22 28-20 86 48Z" fill={C.ink2} opacity=".9" />
      <g className="art-pulse">
        <rect x="150" y="56" width="50" height="22" rx="11" fill={C.sand} />
      </g>
      <text x="175" y="71" fill={C.ink} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        direct
      </text>

      <rect x="56" y="166" width="104" height="11" rx="5.5" fill={C.paper} />
      <rect x="56" y="188" width="72" height="8" rx="4" fill={C.mist} opacity=".55" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={62 + i * 18} cy="218" r="6" fill={C.line} />
      ))}
      <rect x="56" y="236" width="60" height="10" rx="5" fill={C.sand} />

      {/* Two nights selected out of a short strip of dates. */}
      <rect x="236" y="76" width="128" height="148" rx="12" fill={C.ink} stroke={C.line} />
      <rect x="252" y="94" width="58" height="9" rx="4.5" fill={C.paper} />
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const picked = row === 1 && (col === 1 || col === 2);
          return (
            <rect
              key={`${row}-${col}`}
              x={252 + col * 26}
              y={118 + row * 30}
              width="20"
              height="22"
              rx="5"
              fill={picked ? C.sand : C.ink3}
              className={picked ? "art-pulse" : undefined}
            />
          );
        }),
      )}
      <rect x="252" y="212" width="96" height="0" rx="0" fill="none" />
      <text x="300" y="246" fill={C.mist} fontSize="12" fontFamily="monospace" textAnchor="middle">
        2 nights · 4 guests
      </text>
    </g>
  ),

  // A weekly timetable stacking in, above the people who teach it.
  classes: (
    <g>
      <rect x="34" y="40" width="332" height="166" rx="14" fill={C.ink} stroke={C.line} />
      {["M", "T", "W", "T", "F"].map((d, i) => (
        <text
          key={`${d}-${i}`}
          x={74 + i * 62}
          y="66"
          fill={C.mist}
          fontSize="12"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {d}
        </text>
      ))}
      {[
        { row: 0, cols: [0, 2, 4], d: "0s" },
        { row: 1, cols: [1, 3], d: ".3s" },
        { row: 2, cols: [0, 1, 4], d: ".6s" },
      ].map((r) => (
        <g key={r.row} className="art-stack" style={{ animationDelay: r.d }}>
          {r.cols.map((c) => (
            <rect
              key={c}
              x={50 + c * 62}
              y={80 + r.row * 38}
              width="48"
              height="28"
              rx="7"
              fill={r.row === 1 && c === 1 ? C.violet : C.ink3}
            />
          ))}
        </g>
      ))}

      {/* The teachers, and one registration landing. */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={62 + i * 46} cy="240" r="17" fill={C.ink3} stroke={C.line} />
          <circle cx={62 + i * 46} cy="234" r="6" fill={C.mist} opacity=".6" />
          <path d={`M${50 + i * 46} 254a12 12 0 0 1 24 0Z`} fill={C.mist} opacity=".45" />
        </g>
      ))}
      <g className="art-slide">
        <rect x="248" y="222" width="118" height="38" rx="19" fill={C.ink} stroke={C.line} />
        <circle cx="270" cy="241" r="8" fill={C.violet} />
        <rect x="286" y="237" width="64" height="8" rx="4" fill={C.mist} opacity=".75" />
      </g>
    </g>
  ),

  // A spec sheet, with certification seals stamping down onto it.
  supplier: (
    <g>
      <rect x="40" y="38" width="186" height="224" rx="12" fill={C.ink} stroke={C.line} />
      <rect x="62" y="62" width="88" height="14" rx="7" fill={C.paper} />
      <rect x="62" y="88" width="142" height="8" rx="4" fill={C.mist} opacity=".4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} className="art-stack" style={{ animationDelay: `${i * 0.22}s` }}>
          <rect x="62" y={116 + i * 26} width="60" height="9" rx="4.5" fill={C.mist} opacity=".55" />
          <rect x="140" y={116 + i * 26} width="64" height="9" rx="4.5" fill={C.ink3} />
        </g>
      ))}
      <rect x="62" y="250" width="0" height="0" fill="none" />

      {/* Three seals: the thing a foreign buyer actually scans for. */}
      {[
        { y: 62, c: C.leaf, d: "0s" },
        { y: 136, c: C.leaf, d: ".35s" },
        { y: 210, c: C.lime, d: ".7s" },
      ].map((seal) => (
        <g key={seal.y} className="art-grow" style={{ animationDelay: seal.d, transformOrigin: "308px center" }}>
          <circle cx="308" cy={seal.y + 20} r="30" fill={C.ink} stroke={seal.c} strokeWidth="2" />
          <circle cx="308" cy={seal.y + 20} r="22" fill={seal.c} opacity=".14" />
          <path
            d={`M296 ${seal.y + 20}l8 8 16-16`}
            fill="none"
            stroke={seal.c}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      <text x="308" y="286" fill={C.mist} fontSize="12" fontFamily="monospace" textAnchor="middle">
        certified
      </text>
    </g>
  ),
};
