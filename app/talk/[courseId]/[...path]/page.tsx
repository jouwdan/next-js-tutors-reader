import { LoPageView } from "@/components/lo-page"

export default async function TalkPage({ params }: { params: Promise<{ courseId: string; path: string[] }> }) {
  const { courseId, path } = await params
  return <LoPageView courseId={courseId} path={path} type="talk" kind="talk" />
}
