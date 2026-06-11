import { findLab, getCourse, loBaseUrl } from "@/lib/course"
import { CourseError } from "@/components/course-error"
import { LabShell } from "@/components/lab-shell"
import { Markdown } from "@/components/markdown"
import { PdfViewer } from "@/components/pdf-viewer"
import { TopBar } from "@/components/top-bar"

interface LabPageViewProps {
  courseId: string
  path: string[]
  type: "lab" | "tutorial"
}

export async function LabPageView({ courseId, path, type }: LabPageViewProps) {
  const result = await getCourse(courseId)
  if (!result.ok) return <CourseError courseId={courseId} />
  const course = result.course

  const resolved = findLab(course, type, path)
  if (!resolved) return <CourseError courseId={courseId} message={`${type === "lab" ? "Lab" : "Tutorial"} not found`} />
  const { lab, step } = resolved

  const crumbs = [
    { title: course.title, route: course.route },
    ...(lab.breadcrumbs ?? []).slice(1),
    { title: lab.title.trim(), route: lab.route },
  ]

  const steps = (lab.los ?? [])
    .filter((lo) => lo.type === "step")
    .map((lo) => ({ id: lo.id, title: lo.title, route: lo.route }))

  // Tutorials (and labs) without steps render their content/pdf directly
  if (steps.length === 0 || !step) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar crumbs={crumbs} />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 md:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{lab.title.trim()}</h1>
          {lab.pdf ? (
            <PdfViewer url={lab.pdf} title={lab.title.trim()} />
          ) : (
            <Markdown content={lab.contentMd} baseUrl={loBaseUrl(course, lab)} />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar crumbs={crumbs} />
      <main className="flex-1">
        <LabShell labTitle={lab.title.trim()} steps={steps} activeStepId={step.id}>
          <Markdown content={step.contentMd} baseUrl={loBaseUrl(course, lab)} />
        </LabShell>
      </main>
    </div>
  )
}
