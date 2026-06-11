import { Download } from "lucide-react"

export function PdfViewer({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download aria-hidden="true" className="size-4" />
          Download PDF
        </a>
      </div>
      <div className="overflow-hidden rounded-lg border bg-muted/40">
        <iframe src={url} title={title} className="h-[75vh] w-full" />
      </div>
    </div>
  )
}
