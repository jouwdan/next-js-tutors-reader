import type { Lo } from "@/lib/types"

function embedUrl(service: string, id: string): string | undefined {
  switch (service) {
    case "youtube":
      return `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`
    case "heanet":
      return `https://media.heanet.ie/player/${id}`
    case "vimeo":
      return `https://player.vimeo.com/video/${id}`
    default:
      return undefined
  }
}

export function VideoPlayer({ lo }: { lo: Lo }) {
  const ids = lo.videoids?.videoIds ?? []
  // Fall back to treating the raw videoid as YouTube (the Tutors default)
  const primary =
    ids.length > 0 ? ids[0] : lo.videoids?.videoid ? { service: "youtube", id: lo.videoids.videoid } : undefined

  if (!primary) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted/40 text-sm text-muted-foreground">
        No video available
      </div>
    )
  }

  const src = embedUrl(primary.service, primary.id)
  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted/40 text-sm text-muted-foreground">
        Unsupported video service: {primary.service}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-black">
      <iframe
        src={src}
        title={lo.title.trim() || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full"
      />
    </div>
  )
}
