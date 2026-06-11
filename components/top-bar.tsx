import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export interface Crumb {
  title: string
  route: string
}

export function TopBar({ crumbs = [] }: { crumbs?: Crumb[] }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden="true" className="flex size-6 items-center justify-center rounded bg-foreground font-mono text-xs text-background">
              T
            </span>
            <span className="hidden sm:inline">tutors</span>
          </Link>
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              {crumbs.map((crumb, i) => (
                <span key={crumb.route} className="flex min-w-0 items-center gap-1">
                  <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-border" />
                  {i === crumbs.length - 1 ? (
                    <span className="truncate text-foreground" aria-current="page">
                      {crumb.title}
                    </span>
                  ) : (
                    <Link href={crumb.route} className="truncate transition-colors hover:text-foreground">
                      {crumb.title}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
