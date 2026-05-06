import { Construction } from 'lucide-react'
import { PageHeader } from './PageHeader'

interface PlaceholderPageProps {
  title: string
  subtitle?: string
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Construction size={48} strokeWidth={1} />
        <p className="mt-4 text-sm">Este módulo se implementará en fases posteriores.</p>
      </div>
    </div>
  )
}
