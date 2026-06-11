import { LabPageView } from "@/components/lab-page"

export default async function LabPage({ params }: { params: Promise<{ courseId: string; path: string[] }> }) {
  const { courseId, path } = await params
  return <LabPageView courseId={courseId} path={path} type="lab" />
}
