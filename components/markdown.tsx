import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

interface MarkdownProps {
  content: string
  /** Base URL used to resolve relative image/link paths */
  baseUrl?: string
}

function resolveUrl(src: string | undefined, baseUrl?: string): string | undefined {
  if (!src) return src
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src
  if (!baseUrl) return src
  return `${baseUrl.replace(/\/$/, "")}/${src.replace(/^\.?\//, "")}`
}

export function Markdown({ content, baseUrl }: MarkdownProps) {
  return (
    <div className="prose-tutors">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveUrl(typeof src === "string" ? src : undefined, baseUrl) || "/placeholder.svg"} alt={alt ?? ""} loading="lazy" />
          ),
          a: ({ href, children }) => (
            <a href={resolveUrl(href, baseUrl)} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
