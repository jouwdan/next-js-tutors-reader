import { LoPageView } from "@/components/lo-page"

export default async function PodcastPage({ params }: { params: Promise<{ courseId: string; path: string[] }> }) {
  const { courseId, path } = await params
  return <LoPageView courseId={courseId} path={path} type="podcast" kind="podcast" />
}
