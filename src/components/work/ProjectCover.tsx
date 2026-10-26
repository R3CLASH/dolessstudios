import Image from "next/image";
import { getProject } from "@/lib/content";

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

/** Real screenshot when the project has one (framed on an accent glow), otherwise an illustrated cover. */
export function ProjectCover({ slug, className = "", sizes = "(min-width: 768px) 50vw, 100vw" }: { slug: string; className?: string; sizes?: string }) {
  const project = getProject(slug);
  if (project?.image)
    return <ShotCover src={project.image} size={project.imageSize ?? [2400, 1500]} title={project.title} accent={project.accent} className={className} sizes={sizes} />;
  return (
    <svg viewBox="0 0 800 560" className={className} role="img" aria-label={`${slug} cover illustration`} preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="560" fill={C.ink2} />
      {COVERS[slug] ?? null}
    </svg>
  );
}

/** Screenshot set into the card like a product shot: accent glow and dot grid behind a floating frame. */
function ShotCover({
  src,
  size,
  title,
  accent,
  className,
  sizes,
}: {
  src: string;
  size: [number, number];
  title: string;
  accent: string;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-ink-2 ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `radial-gradient(90% 70% at 50% 0%, ${accent}66 0%, ${accent}1f 38%, transparent 70%)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        style={{ backgroundImage: "radial-gradient(rgba(239,241,243,0.18) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />
      <div
        className="relative w-[88%] overflow-hidden rounded-[clamp(8px,1.2vw,18px)] border border-paper/15"
        style={{ boxShadow: `0 30px 80px -30px ${accent}99, 0 20px 40px -20px rgba(0,0,0,0.7)` }}
      >
        <Image src={src} alt={`${title} screenshot`} width={size[0]} height={size[1]} sizes={sizes} className="block h-auto w-full" />
      </div>
    </div>
  );
}

const stars = (x: number, y: number, n: number) =>
  [0, 1, 2, 3, 4].map((i) => (
    <path
      key={i}
      transform={`translate(${x + i * 22} ${y}) scale(0.8)`}
      d="M10 0l3 6.5 7 .8-5.2 4.8 1.4 7L10 15.6 3.8 19.1l1.4-7L0 7.3l7-.8z"
      fill={i < n ? C.accent : C.line}
    />
  ));

const COVERS: Record<string, React.ReactNode> = {
  thememerge: (
    <g>
      <rect width="800" height="560" fill={C.ink2} />
      {[0, 1].map((col) => (
        <g key={col} transform={`translate(${60 + col * 250} 80)`}>
          <rect width="220" height="300" rx="16" fill={C.ink} stroke={C.line} />
          <text x="18" y="32" fontFamily="monospace" fontSize="13" fill={C.mist}>
            {col === 0 ? "live theme" : "dev copy"}
          </text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const changed = col === 0 ? i === 2 || i === 6 : i === 4 || i === 5;
            return (
              <rect
                key={i}
                x="18"
                y={52 + i * 26}
                width={[150, 120, 170, 90, 160, 130, 110, 175, 100][i]}
                height="10"
                rx="5"
                fill={changed ? (col === 0 ? C.violet : C.accent) : C.line}
              />
            );
          })}
        </g>
      ))}
      <path d="M170 380 C 170 450, 400 420, 560 330" fill="none" stroke={C.violet} strokeWidth="3" />
      <path d="M420 380 C 420 430, 480 400, 560 300" fill="none" stroke={C.accent} strokeWidth="3" />
      <g transform="translate(560 160)">
        <rect width="190" height="300" rx="16" fill={C.ink} stroke={C.paper} strokeWidth="2" />
        <text x="18" y="32" fontFamily="monospace" fontSize="13" fill={C.paper}>
          merged ✓
        </text>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <rect
            key={i}
            x="18"
            y={52 + i * 26}
            width={[130, 110, 150, 80, 140, 115, 100, 150, 90][i]}
            height="10"
            rx="5"
            fill={i === 2 || i === 6 ? C.violet : i === 4 || i === 5 ? C.accent : C.line}
          />
        ))}
      </g>
    </g>
  ),
  "aito-auto": (
    <g>
      <rect width="800" height="560" fill={C.ink2} />
      <rect x="80" y="60" width="640" height="440" rx="24" fill={C.ink} stroke={C.line} />
      <rect x="80" y="60" width="640" height="56" rx="24" fill={C.ink3} />
      <text x="110" y="95" fontFamily="sans-serif" fontWeight="700" fontSize="20" fill={C.paper}>
        aito auto
      </text>
      <text x="690" y="95" textAnchor="end" fontFamily="monospace" fontSize="13" fill={C.mist}>
        autot · rahoitus · yhteys
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${110 + i * 200} 146)`}>
          <rect width="180" height="320" rx="16" fill={C.ink3} />
          <rect x="12" y="12" width="156" height="120" rx="10" fill={C.ink2} />
          <path
            d="M30 104 Q 38 80 64 76 L 92 64 Q 110 58 128 70 L 146 78 Q 158 82 158 98 L 158 108 L 30 108 Z"
            fill={[C.teal, C.paper, C.accent][i]}
          />
          <circle cx="58" cy="110" r="11" fill={C.ink} stroke={C.mist} strokeWidth="3" />
          <circle cx="132" cy="110" r="11" fill={C.ink} stroke={C.mist} strokeWidth="3" />
          <rect x="12" y="150" width="120" height="12" rx="6" fill={C.paper} />
          <rect x="12" y="172" width="80" height="10" rx="5" fill={C.line} />
          <rect x="12" y="190" width="100" height="10" rx="5" fill={C.line} />
          <rect x="12" y="266" width="90" height="36" rx="18" fill={C.teal} />
          <text x="57" y="289" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={C.ink}>
            katso
          </text>
        </g>
      ))}
    </g>
  ),
};
