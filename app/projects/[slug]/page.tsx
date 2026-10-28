import { notFound } from 'next/navigation'
import { projects } from '@/constants/projects'
import ProjectDetail from '@/components/ProjectDetail'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  return { title: project ? `${project.title} | Sk Md Jeesan` : 'Project' }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  return <ProjectDetail project={project} />
}