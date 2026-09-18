import {
  CheckCircle2,
  Code2,
  Component,
  Database,
  Radio,
  RefreshCw,
  Webhook,
  type LucideIcon,
} from 'lucide-react';
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siDotnet,
  siSwift,
  siPython,
  siHtml5,
  siGit,
  siGithub,
  siPostman,
  siDocker,
  siMysql,
  siFirebase,
  siFigma,
  siBlockbench,
  siVercel,
} from 'simple-icons';

type IconEntry =
  | { type: 'brand'; path: string }
  | { type: 'lucide'; Icon: LucideIcon };

// Keyed by the exact label string used in messages/*.json (Site.about.technologies/skills/tools).
// Technologies and tools are proper nouns and match across locales; skills are translated per
// locale, so both the tr and en label appear here pointing at the same icon.
const ICON_MAP: Record<string, IconEntry> = {
  React: { type: 'brand', path: siReact.path },
  'Next.js': { type: 'brand', path: siNextdotjs.path },
  TypeScript: { type: 'brand', path: siTypescript.path },
  JavaScript: { type: 'brand', path: siJavascript.path },
  '.NET / C#': { type: 'brand', path: siDotnet.path },
  SwiftUI: { type: 'brand', path: siSwift.path },
  Python: { type: 'brand', path: siPython.path },
  SQL: { type: 'lucide', Icon: Database },
  'HTML / CSS': { type: 'brand', path: siHtml5.path },

  'Responsive Arayüzler': { type: 'lucide', Icon: Component },
  'Responsive Interfaces': { type: 'lucide', Icon: Component },
  'Bileşen Tabanlı UI Mimarisi': { type: 'lucide', Icon: Component },
  'Component-Based UI Architecture': { type: 'lucide', Icon: Component },
  'REST API Entegrasyonu': { type: 'lucide', Icon: Webhook },
  'REST API Integration': { type: 'lucide', Icon: Webhook },
  'Server-Sent Events (SSE)': { type: 'lucide', Icon: Radio },
  'State Management': { type: 'lucide', Icon: RefreshCw },
  'Temiz Kod & OOP': { type: 'lucide', Icon: CheckCircle2 },
  'Clean Code & OOP': { type: 'lucide', Icon: CheckCircle2 },

  'VS Code': { type: 'lucide', Icon: Code2 },
  Git: { type: 'brand', path: siGit.path },
  GitHub: { type: 'brand', path: siGithub.path },
  Postman: { type: 'brand', path: siPostman.path },
  Docker: { type: 'brand', path: siDocker.path },
  'MySQL Workbench': { type: 'brand', path: siMysql.path },
  Firebase: { type: 'brand', path: siFirebase.path },
  Figma: { type: 'brand', path: siFigma.path },
  Blockbench: { type: 'brand', path: siBlockbench.path },
  Vercel: { type: 'brand', path: siVercel.path },
};

export function ToolkitIcon({ label }: { label: string }) {
  const entry = ICON_MAP[label];

  if (!entry) {
    return <Code2 className="toolkit-icon" aria-hidden="true" />;
  }

  if (entry.type === 'lucide') {
    const { Icon } = entry;
    return <Icon className="toolkit-icon" aria-hidden="true" />;
  }

  return (
    <svg
      className="toolkit-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={entry.path} />
    </svg>
  );
}
