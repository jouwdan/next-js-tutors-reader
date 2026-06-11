import {
  Archive,
  BookOpen,
  FileText,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Layers,
  Mic,
  Presentation,
  Video,
  Globe,
  type LucideIcon,
} from "lucide-react"
import type { Lo, LoType } from "./types"

interface LoMeta {
  icon: LucideIcon
  label: string
  /** tailwind text color class for the icon accent */
  color: string
}

export const LO_META: Record<LoType, LoMeta> = {
  course: { icon: GraduationCap, label: "Course", color: "text-foreground" },
  topic: { icon: Layers, label: "Topic", color: "text-sky-600 dark:text-sky-400" },
  unit: { icon: Layers, label: "Unit", color: "text-muted-foreground" },
  side: { icon: Layers, label: "Unit", color: "text-muted-foreground" },
  talk: { icon: Presentation, label: "Talk", color: "text-amber-600 dark:text-amber-400" },
  paneltalk: { icon: Presentation, label: "Talk", color: "text-amber-600 dark:text-amber-400" },
  lab: { icon: FlaskConical, label: "Lab", color: "text-emerald-600 dark:text-emerald-400" },
  step: { icon: FlaskConical, label: "Step", color: "text-emerald-600 dark:text-emerald-400" },
  tutorial: { icon: BookOpen, label: "Tutorial", color: "text-emerald-600 dark:text-emerald-400" },
  note: { icon: FileText, label: "Note", color: "text-sky-600 dark:text-sky-400" },
  panelnote: { icon: FileText, label: "Note", color: "text-sky-600 dark:text-sky-400" },
  video: { icon: Video, label: "Video", color: "text-rose-600 dark:text-rose-400" },
  panelvideo: { icon: Video, label: "Video", color: "text-rose-600 dark:text-rose-400" },
  web: { icon: Globe, label: "Link", color: "text-muted-foreground" },
  github: { icon: GitBranch, label: "Repo", color: "text-muted-foreground" },
  archive: { icon: Archive, label: "Archive", color: "text-muted-foreground" },
  podcast: { icon: Mic, label: "Podcast", color: "text-muted-foreground" },
}

export function loMeta(type: LoType): LoMeta {
  return LO_META[type] ?? LO_META.note
}

/**
 * Courses can define per-LO Iconify icons (e.g. "ri:plant-fill") with a custom
 * color, either directly on the LO or in its frontmatter. Resolve them to an
 * Iconify CDN SVG URL so no icon library is needed at runtime.
 */
export function customIconUrl(lo: Pick<Lo, "icon" | "frontMatter">): string | undefined {
  const icon = lo.icon ?? lo.frontMatter?.icon
  if (!icon?.type || !icon.type.includes(":")) return undefined

  const [prefix, name] = icon.type.split(":")
  let color = String(icon.color ?? "currentColor").trim()
  // Hex colors are often stored without "#" (and sometimes as bare numbers)
  if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(color)) {
    color = `#${color.length === 3 ? color : color.padStart(6, "0")}`
  }
  return `https://api.iconify.design/${prefix}/${name}.svg?color=${encodeURIComponent(color)}`
}
