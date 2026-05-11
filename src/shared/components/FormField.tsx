import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseStyles = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-navy placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold text-navy block mb-1">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-600">{error}</p>}
    </div>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={baseStyles} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select className={baseStyles} {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${baseStyles} resize-none`} rows={3} {...props} />
}
