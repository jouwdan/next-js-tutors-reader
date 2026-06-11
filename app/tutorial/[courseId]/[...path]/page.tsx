import { LabPageView } from "@/components/lab-page"

export default async function TutorialPage({ params }: { params: Promise<{ courseId: string; path: string[] }> }) {
  const { courseId, path } = await params
  return <LabPageView courseId={courseId} path={path} type="tutorial" />
}
