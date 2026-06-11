import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { loMeta } from "@/lib/icons"
import type { Lo } from "@/lib/types"

const EXTERNAL = new Set(["web", "github", "archive"])

export function LoCard({ lo }: { lo: Lo }) {
  const meta = loMeta(lo.type)
  const Icon = meta.icon
  const external = EXTERNAL.has(lo.type)
  const title = lo.title.trim()

  const inner = (
    <>
      {lo.img ? (
        <div className="flex h-36 items-center justify-center overflow-hidden border-b bg-muted/40 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lo.img || "/placeholder.svg"}
            alt=""
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center border-b bg-muted/40">
          <Icon aria-hidden="true" className={`size-8 ${meta.color} opacity-60`} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2">
          <Icon aria-hidden="true" className={`size-4 shrink-0 ${meta.color}`} />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
          {external && <ArrowUpRight aria-hidden="true" className="ml-auto size-3.5 text-muted-foreground" />}
        </div>
        <h3 className="font-medium leading-snug text-pretty">{title}</h3>
        {lo.summary && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{lo.summary}</p>}
      </div>
    </>
  )

  const className =
    "group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/30 hover:bg-muted/30"

  if (external) {
    return (
      <a href={lo.route} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={lo.route} className={className}>
      {inner}
    </Link>
  )
}
