import { CourseLauncher } from "@/components/course-launcher"
import { TopBar } from "@/components/top-bar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-16 md:px-6 md:py-24">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tutors Reader</span>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            An open learning experience platform
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            Browse any published Tutors course — structured topics, hands-on labs, talks, notes, and videos, rendered
            in a clean reading experience.
          </p>
        </div>
        <CourseLauncher />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground md:px-6">
          <p>
            Built on the{" "}
            <a
              href="https://tutors.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Tutors
            </a>{" "}
            open source project
          </p>
          <p className="font-mono text-xs">tutors-sdk</p>
        </div>
      </footer>
    </div>
  )
}
