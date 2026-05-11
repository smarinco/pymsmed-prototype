import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl',
  secondary: 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 rounded-lg',
  danger: 'text-red-400 hover:text-red-600 rounded-lg',
  ghost: 'text-accent hover:text-accent-hover rounded-lg',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[14px]',
  md: 'px-4 py-2 text-[15px]',
  lg: 'px-5 py-2.5 text-[15px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
