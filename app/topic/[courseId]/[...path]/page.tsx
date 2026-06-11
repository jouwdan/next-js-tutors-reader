import type { Metadata } from "next"
import { findLo, getCourse, loBaseUrl } from "@/lib/course"
import { CourseError } from "@/components/course-error"
import { Markdown } from "@/components/markdown"
import { PdfViewer } from "@/components/pdf-viewer"
import { TopBar } from "@/components/top-bar"
import { CardGrid, UnitSection } from "@/components/unit-section"
import { VideoPlayer } from "@/components/video-player"
import type { Lo } from "@/lib/types"

interface Props {
  params: Promise<{ courseId: string; path: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId, path } = await params
  const result = await getCourse(courseId)
  if (!result.ok) return { title: "Not found — Tutors Reader" }
  const topic = findLo(result.course, "topic", path)
  return { title: topic ? `${topic.title.trim()} — ${result.course.title}` : "Not found — Tutors Reader" }
}

export default async function TopicPage({ params }: Props) {
  const { courseId, path } = await params
  const result = await getCourse(courseId)
  if (!result.ok) return <CourseError courseId={courseId} />

  const course = result.course
  const topic = findLo(course, "topic", path)
  if (!topic) return <CourseError courseId={courseId} message="Topic not found" />

  const children = topic.los ?? []
  const units = children.filter((lo) => lo.type === "unit")
  const sides = children.filter((lo) => lo.type === "side")
  const panels = children.filter((lo) => ["panelnote", "paneltalk", "panelvideo"].includes(lo.type))
  const standalone = children.filter(
    (lo) => !["unit", "side", "panelnote", "paneltalk", "panelvideo"].includes(lo.type),
  )

  const crumbs = [
    { title: course.title, route: course.route },
    { title: topic.title.trim(), route: topic.route },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar crumbs={crumbs} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 md:px-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{topic.title.trim()}</h1>
          {topic.summary && <p className="max-w-2xl leading-relaxed text-muted-foreground">{topic.summary}</p>}
        </header>

        {panels.map((panel) => (
          <PanelSection key={panel.id} panel={panel} baseUrl={loBaseUrl(course, panel)} />
        ))}

        <div className={sides.length > 0 ? "grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]" : "flex flex-col gap-10"}>
          <div className="flex min-w-0 flex-col gap-10">
            {units.map((unit) => (
              <UnitSection key={unit.id} unit={unit} />
            ))}
            {standalone.length > 0 && <CardGrid los={standalone} />}
          </div>
          {sides.length > 0 && (
            <aside className="flex flex-col gap-8">
              {sides.map((side) => (
                <UnitSection key={side.id} unit={side} />
              ))}
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

function PanelSection({ panel, baseUrl }: { panel: Lo; baseUrl: string }) {
  if (panel.type === "panelvideo") {
    return (
      <section className="flex flex-col gap-3">
        {panel.title.trim() && <h2 className="text-lg font-semibold tracking-tight">{panel.title.trim()}</h2>}
        <VideoPlayer lo={panel} />
      </section>
    )
  }
  if (panel.type === "paneltalk" && panel.pdf) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{panel.title.trim()}</h2>
        <PdfViewer url={panel.pdf} title={panel.title.trim()} />
      </section>
    )
  }
  // panelnote
  return (
    <section className="rounded-lg border bg-card p-6 md:p-8">
      <Markdown content={panel.contentMd} baseUrl={baseUrl} />
    </section>
  )
}
