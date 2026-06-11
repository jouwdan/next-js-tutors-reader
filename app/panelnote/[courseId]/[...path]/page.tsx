import { LoPageView } from "@/components/lo-page"

export default async function PanelNotePage({ params }: { params: Promise<{ courseId: string; path: string[] }> }) {
  const { courseId, path } = await params
  return <LoPageView courseId={courseId} path={path} type="panelnote" kind="note" />
}
