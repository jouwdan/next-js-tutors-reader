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
import type { LoType } from "./types"

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
