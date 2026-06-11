import { findLo, getCourse, loBaseUrl } from "@/lib/course"
import { CourseError } from "@/components/course-error"
import { Markdown } from "@/components/markdown"
import { PdfViewer } from "@/components/pdf-viewer"
import { TopBar } from "@/components/top-bar"
import { VideoPlayer } from "@/components/video-player"
import type { LoType } from "@/lib/types"

interface LoPageViewProps {
  courseId: string
  path: string[]
  type: LoType
  kind: "note" | "talk" | "video"
}

export async function LoPageView({ courseId, path, type, kind }: LoPageViewProps) {
  const result = await getCourse(courseId)
  if (!result.ok) return <CourseError courseId={courseId} />
  const course = result.course

  const lo = findLo(course, type, path)
  if (!lo) return <CourseError courseId={courseId} message="Content not found" />

  const crumbs = [
    { title: course.title, route: course.route },
    ...(lo.breadcrumbs ?? []).slice(1),
    { title: lo.title.trim(), route: lo.route },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar crumbs={crumbs} />
      <main
        className={`mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-10 md:px-6 ${
          kind === "note" ? "max-w-3xl" : "max-w-5xl"
        }`}
      >
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{lo.title.trim()}</h1>
          {lo.summary && <p className="leading-relaxed text-muted-foreground">{lo.summary}</p>}
        </header>

        {kind === "video" && <VideoPlayer lo={lo} />}
        {kind === "talk" &&
          (lo.pdf ? (
            <PdfViewer url={lo.pdf} title={lo.title.trim()} />
          ) : (
            <p className="text-muted-foreground">No PDF available for this talk.</p>
          ))}
        {kind === "note" && <Markdown content={lo.contentMd} baseUrl={loBaseUrl(course, lo)} />}
      </main>
    </div>
  )
}
