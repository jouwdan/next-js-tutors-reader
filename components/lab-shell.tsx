"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface LabStep {
  id: string
  title: string
  route: string
}

interface LabShellProps {
  labTitle: string
  steps: LabStep[]
  activeStepId: string
  children: ReactNode
}

export function LabShell({ labTitle, steps, activeStepId, children }: LabShellProps) {
  const router = useRouter()
  const activeIndex = steps.findIndex((s) => s.id === activeStepId)
  const prev = activeIndex > 0 ? steps[activeIndex - 1] : undefined
  const next = activeIndex < steps.length - 1 ? steps[activeIndex + 1] : undefined

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "ArrowLeft" && prev) router.push(prev.route)
      if (e.key === "ArrowRight" && next) router.push(next.route)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [prev, next, router])

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <nav aria-label="Lab steps" className="flex flex-col gap-1">
          <h2 className="mb-2 px-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {labTitle}
          </h2>
          {steps.map((step, i) => {
            const active = step.id === activeStepId
            return (
              <Link
                key={step.id}
                href={step.route}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded border font-mono text-[10px] ${
                    active ? "border-foreground/40 text-foreground" : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                >
                  {i}
                </span>
                <span className="truncate">{step.title.trim()}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col gap-8">
        <article>{children}</article>
        <footer className="flex items-center justify-between border-t pt-6">
          {prev ? (
            <Link
              href={prev.route}
              className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              {prev.title.trim()}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={next.route}
              className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {next.title.trim()}
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </footer>
      </div>
    </div>
  )
}
