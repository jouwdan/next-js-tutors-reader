import Link from "next/link"
import { SearchX } from "lucide-react"
import { TopBar } from "./top-bar"

export function CourseError({ courseId, message }: { courseId?: string; message?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {message ?? "Course not found"}
        </h1>
        <p className="max-w-md text-muted-foreground leading-relaxed">
          {courseId ? (
            <>
              We couldn&apos;t load <span className="font-mono text-sm text-foreground">{courseId}</span>. Check the
              course ID and try again.
            </>
          ) : (
            "The content you were looking for could not be found."
          )}
        </p>
        <Link
          href="/"
          className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Back to course launcher
        </Link>
      </main>
    </div>
  )
}
