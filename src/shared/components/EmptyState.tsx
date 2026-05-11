import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  action?: ReactNode
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <Inbox size={36} strokeWidth={1.5} className="mx-auto text-gray-300" />
      <p className="mt-2 text-[13px] text-gray-300">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
