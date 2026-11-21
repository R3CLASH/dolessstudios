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
  startup: "A landing page assembling itself above a rising chart",
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

  // A one-page landing assembling itself, with a growing metric chart.
  startup: (
    <g>
      <rect x="40" y="38" width="320" height="224" rx="14" fill={C.ink} stroke={C.line} />
      <circle cx="62" cy="58" r="5" fill={C.violet} />
      <circle cx="78" cy="58" r="5" fill={C.line} />
      <circle cx="94" cy="58" r="5" fill={C.line} />
      <rect x="120" y="51" width="150" height="14" rx="7" fill={C.ink3} />

      <g className="art-slide" style={{ animationDelay: "0s" }}>
        <rect x="64" y="88" width="168" height="24" rx="6" fill={C.paper} />
        <rect x="64" y="122" width="120" height="10" rx="5" fill={C.mist} opacity=".6" />
      </g>
      <g className="art-slide" style={{ animationDelay: ".35s" }}>
        <rect x="64" y="148" width="92" height="30" rx="15" fill={C.violet} />
        <rect x="166" y="148" width="66" height="30" rx="15" fill={C.ink3} />
      </g>

      <rect x="256" y="88" width="84" height="90" rx="10" fill={C.ink3} />
      {[
        { x: 268, h: 30, d: "0s" },
        { x: 288, h: 46, d: ".2s" },
        { x: 308, h: 62, d: ".4s" },
      ].map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={164 - b.h}
          width="12"
          height={b.h}
          rx="3"
          fill={C.violet}
          className="art-grow"
          style={{ animationDelay: b.d }}
        />
      ))}

      <rect x="64" y="200" width="276" height="42" rx="10" fill={C.ink2} stroke={C.line} />
      <rect x="80" y="214" width="150" height="14" rx="7" fill={C.ink3} />
      <rect x="244" y="209" width="80" height="24" rx="12" fill={C.lime} />
      <rect x="236" y="214" width="2" height="14" fill={C.paper} className="art-blink" />
    </g>
  ),
};
