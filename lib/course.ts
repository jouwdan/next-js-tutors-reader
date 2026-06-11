import type { Course, CourseResult, Lo, LoType } from "./types"

const COURSE_URL_PLACEHOLDER = /\{\{COURSEURL\}\}/g

/** LO types that render as cards linking to internal routes */
export const ROUTED_TYPES: LoType[] = [
  "topic",
  "talk",
  "lab",
  "note",
  "video",
  "panelvideo",
  "panelnote",
  "paneltalk",
  "tutorial",
]

/** LO types that are external links */
export const EXTERNAL_TYPES: LoType[] = ["web", "github"]

function courseUrlFor(courseId: string): string {
  // Course IDs may already be full domains (e.g. "tutors-reference.netlify.app")
  if (courseId.includes(".")) return courseId
  return `${courseId}.netlify.app`
}

/**
 * Recursively decorate the LO tree:
 * - replace {{COURSEURL}} in asset URLs with the real course domain
 * - rewrite internal routes from /type/{{COURSEURL}}/path to /type/{courseId}/path
 * - drop hidden LOs
 * - attach breadcrumb trails
 */
function decorate(
  lo: Lo,
  courseId: string,
  courseUrl: string,
  trail: { title: string; route: string; type: LoType }[],
): Lo {
  const decorated: Lo = { ...lo }

  // Asset URLs: real domain
  if (decorated.img) decorated.img = decorated.img.replace(COURSE_URL_PLACEHOLDER, courseUrl)
  if (decorated.pdf) decorated.pdf = decorated.pdf.replace(COURSE_URL_PLACEHOLDER, courseUrl)
  if (decorated.video) decorated.video = decorated.video.replace(COURSE_URL_PLACEHOLDER, courseId)

  // Internal routes: /type/{courseId}/...
  if (decorated.route) {
    decorated.route = decorated.route.replace(COURSE_URL_PLACEHOLDER, courseId)
    // Legacy courses use hash-style routes ("#topic/...") instead of path routes
    if (decorated.route.startsWith("#")) {
      decorated.route = `/${decorated.route.slice(1)}`
    }
  }

  // Legacy lab steps have no type/id; derive them from the route and clean the title
  if ((!decorated.type || String(decorated.type) === "None") && decorated.contentMd !== undefined) {
    decorated.type = "step"
    if (!decorated.id || String(decorated.id) === "None") {
      decorated.id = decorated.route?.split("/").pop() ?? decorated.shortTitle ?? ""
    }
    decorated.title = (decorated.shortTitle ?? decorated.title ?? "").replace(/^#+\s*/, "").trim()
  }
  // Archives link directly to the zip file on the course domain
  if (decorated.type === "archive" && decorated.archiveFile) {
    const path = decorated.route.split(`/${courseId}/`)[1] ?? ""
    decorated.route = `https://${courseUrl}/${path}/${decorated.archiveFile}`
  }

  decorated.breadcrumbs = trail

  if (lo.los) {
    const nextTrail =
      lo.type === "unit" || lo.type === "side"
        ? trail
        : [...trail, { title: decorated.title.trim(), route: decorated.route, type: decorated.type }]
    decorated.los = lo.los
      .filter((child) => !child.hide)
      .map((child) => decorate(child, courseId, courseUrl, nextTrail))
  }

  return decorated
}

export async function getCourse(courseId: string): Promise<CourseResult> {
  const id = courseId.trim().toLowerCase().replace(/\/$/, "")
  if (!id || !/^[a-z0-9.-]+$/.test(id)) return { ok: false, error: "invalid" }

  const courseUrl = courseUrlFor(id)

  try {
    const res = await fetch(`https://${courseUrl}/tutors.json`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return { ok: false, error: "not-found" }
    const raw = (await res.json()) as Lo
    if (!raw || raw.type !== "course") return { ok: false, error: "not-found" }

    const decorated = decorate(raw, id, courseUrl, []) as Course
    decorated.courseId = id
    decorated.courseUrl = courseUrl
    decorated.title = decorated.title.trim()
    decorated.route = `/course/${id}`
    return { ok: true, course: decorated }
  } catch {
    return { ok: false, error: "not-found" }
  }
}

/**
 * Find an LO in the course tree by matching the tail of its route.
 * `loPath` is the path segments after /{type}/{courseId}/ in the URL.
 */
/** Route prefix → LO types that may live under it */
const COMPATIBLE_TYPES: Partial<Record<LoType, LoType[]>> = {
  topic: ["topic", "side"],
  video: ["video", "panelvideo"],
  talk: ["talk", "paneltalk"],
  note: ["note", "panelnote"],
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

export function findLo(course: Course, type: LoType, loPath: string[]): Lo | undefined {
  const target = `/${type}/${course.courseId}/${loPath.map(decodeSegment).join("/")}`.replace(/\/+$/, "")
  const accepted = COMPATIBLE_TYPES[type] ?? [type]
  let found: Lo | undefined

  function walk(lo: Lo) {
    if (found) return
    if (lo.route?.replace(/\/+$/, "") === target && accepted.includes(lo.type)) {
      found = lo
      return
    }
    lo.los?.forEach(walk)
  }
  walk(course)
  return found
}

/**
 * Resolve a lab (or tutorial) plus the active step from a URL path.
 * The last path segment may be a step id; if no exact lab match,
 * retry with the last segment dropped.
 */
export function findLab(
  course: Course,
  type: "lab" | "tutorial",
  loPath: string[],
): { lab: Lo; step: Lo | undefined } | undefined {
  let lab = findLo(course, type, loPath)
  let stepId: string | undefined

  if (!lab && loPath.length > 1) {
    stepId = decodeSegment(loPath[loPath.length - 1])
    lab = findLo(course, type, loPath.slice(0, -1))
  }
  if (!lab) return undefined

  const steps = (lab.los ?? []).filter((lo) => lo.type === "step")
  const step = stepId ? steps.find((s) => s.id === stepId) : steps[0]
  return { lab, step: step ?? steps[0] }
}

/** Base URL for resolving relative markdown images of an LO */
export function loBaseUrl(course: Course, lo: Lo): string {
  const path = lo.route.split(`/${course.courseId}/`)[1] ?? ""
  return `https://${course.courseUrl}/${path}`
}
