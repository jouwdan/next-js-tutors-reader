import type { Metadata } from "next"
import { getCourse } from "@/lib/course"
import { CourseError } from "@/components/course-error"
import { LoCard } from "@/components/lo-card"
import { TopBar } from "@/components/top-bar"

interface Props {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params
  const result = await getCourse(courseId)
  if (!result.ok) return { title: "Course not found — Tutors Reader" }
  return {
    title: `${result.course.title} — Tutors Reader`,
    description: result.course.summary,
  }
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params
  const result = await getCourse(courseId)

  if (!result.ok) return <CourseError courseId={courseId} />
  const course = result.course
  const topics = (course.los ?? []).filter((lo) => lo.type === "topic")
  const credits = course.properties?.credits as string | undefined

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar crumbs={[{ title: course.title, route: course.route }]} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 md:px-6">
        <header className="flex flex-col gap-5 md:flex-row md:items-center">
          {course.img && (
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={course.img || "/placeholder.svg"} alt="" className="max-h-full max-w-full object-contain" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">{course.title}</h1>
            {course.summary && (
              <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">{course.summary}</p>
            )}
            {credits && <p className="text-sm text-muted-foreground">{credits}</p>}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <LoCard key={topic.id} lo={topic} />
          ))}
        </div>
      </main>
    </div>
  )
}
