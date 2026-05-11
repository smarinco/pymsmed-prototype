import type { ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

const variantStyles: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-500',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-50 text-blue-600',
  accent: 'bg-accent/10 text-accent',
}

interface BadgeProps {
  children: ReactNode
  variant?: Variant
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}
