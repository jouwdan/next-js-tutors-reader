export type LoType =
  | "course"
  | "topic"
  | "unit"
  | "side"
  | "talk"
  | "lab"
  | "step"
  | "note"
  | "video"
  | "panelvideo"
  | "panelnote"
  | "paneltalk"
  | "tutorial"
  | "web"
  | "archive"
  | "github"
  | "podcast"

export interface IconType {
  type: string
  color?: string | number
}

export interface VideoIdentifier {
  service: string
  id: string
}

export interface VideoIdentifiers {
  videoid: string
  videoIds: VideoIdentifier[]
}

export interface Lo {
  type: LoType
  id: string
  title: string
  shortTitle?: string
  summary: string
  contentMd: string
  route: string
  img: string
  imgFile?: string
  icon?: IconType
  frontMatter?: { icon?: IconType; [key: string]: unknown }
  video: string
  videoids?: VideoIdentifiers
  pdf?: string
  pdfFile?: string
  episode?: { service: string; id: string }
  archiveFile?: string
  hide: boolean
  authLevel?: number
  los?: Lo[]
  properties?: Record<string, unknown>
  /** Breadcrumb trail from course down to this LO (decorated client-side safe) */
  breadcrumbs?: { title: string; route: string; type: LoType }[]
}

export interface Course extends Lo {
  type: "course"
  courseId: string
  courseUrl: string
}

export type CourseResult =
  | { ok: true; course: Course }
  | { ok: false; error: "not-found" | "invalid" }
