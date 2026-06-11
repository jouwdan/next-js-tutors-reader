"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, GraduationCap } from "lucide-react"

const SAMPLE_COURSES = [
  {
    id: "reference-course",
    title: "Reference Course",
    description: "Every supported learning object — topics, labs, talks, notes, and videos.",
  },
  {
    id: "tutors-reference-manual",
    title: "Tutors Reference Manual",
    description: "The official manual for building courses with the Tutors toolkit.",
  },
  {
    id: "classic-design-patterns",
    title: "Classic Design Patterns",
    description: "The Gang of Four design patterns, explained and explored.",
  },
  {
    id: "full-stack-web-dev-oth-2022",
    title: "Full Stack Web Development",
    description: "A complete full-stack development course from OTH Regensburg.",
  },
  {
    id: "wit-hdip-comp-sci-2024-full-stack-1",
    title: "Full Stack 1 (HDip)",
    description: "Higher Diploma in Computer Science full-stack module from SETU.",
  },
  {
    id: "wad2-2023",
    title: "Web App Development 2",
    description: "Building modern web applications, semester two.",
  },
]

export function CourseLauncher() {
  const router = useRouter()
  const [courseId, setCourseId] = useState("")

  function launch(e: React.FormEvent) {
    e.preventDefault()
    const id = courseId.trim().toLowerCase().replace(/\/$/, "")
    if (id) router.push(`/course/${encodeURIComponent(id)}`)
  }

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={launch} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="course-id" className="sr-only">
          Course ID
        </label>
        <input
          id="course-id"
          type="text"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter a course ID, e.g. reference-course"
          autoComplete="off"
          spellCheck={false}
          className="h-11 flex-1 rounded-md border bg-background px-4 font-mono text-sm outline-none transition-colors placeholder:font-sans focus:border-foreground/40"
        />
        <button
          type="submit"
          className="flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Open course
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </form>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sample courses</h2>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_COURSES.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => router.push(`/course/${course.id}`)}
              className="group flex flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-colors hover:border-foreground/30 hover:bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <GraduationCap aria-hidden="true" className="size-4 text-muted-foreground" />
                <span className="font-mono text-[11px] text-muted-foreground">{course.id}</span>
              </div>
              <h3 className="font-medium leading-snug">{course.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
