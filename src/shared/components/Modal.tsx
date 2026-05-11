import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeStyles[size]} rounded-xl bg-white shadow-2xl mx-4`}>
        <div className="bg-navy px-6 py-5 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-white">{title}</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
