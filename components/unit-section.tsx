import { LoCard } from "./lo-card"
import type { Lo } from "@/lib/types"

export function CardGrid({ los }: { los: Lo[] }) {
  if (los.length === 0) return null
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {los.map((lo) => (
        <LoCard key={lo.route + lo.id} lo={lo} />
      ))}
    </div>
  )
}

export function UnitSection({ unit }: { unit: Lo }) {
  const children = (unit.los ?? []).filter((lo) => lo.type !== "step")
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{unit.title.trim()}</h2>
        <div className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <CardGrid los={children} />
    </section>
  )
}
