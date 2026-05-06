import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import type { EntornoConfig } from '../entorno-config'
import type { EntornoGenerico } from '../seed-entornos'

interface Props {
  config: EntornoConfig
}

export function GenericEntornoCreatePage({ config }: Props) {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const basePath = `/entornos/${config.tipo}`
  const [form, setForm] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    config.campos.forEach((c) => {
      if (c.required && !form[c.key]?.trim()) newErrors[c.key] = 'Obligatorio'
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const items: EntornoGenerico[] = JSON.parse(localStorage.getItem(config.storageKey) || '[]')
    const now = new Date().toISOString()
    const nuevo: EntornoGenerico = {
      id: `${config.tipo[0]}${Date.now()}`,
      codigo: `${config.codigoPrefix}-${String(items.length + 1).padStart(3, '0')}`,
      ...form,
      estado: 'activo',
      creadoPor: usuario.nombre, creadoEn: now,
      actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    items.push(nuevo)
    localStorage.setItem(config.storageKey, JSON.stringify(items))
    navigate(`${basePath}/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader
        title={`Nuevo ${config.label}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: config.labelPlural, to: basePath }, { label: 'Nuevo' }]}
      />
      <form onSubmit={handleSubmit}>
        <Card title={`Datos del ${config.label.toLowerCase()}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {config.campos.map((campo) => (
              <div key={campo.key} className={campo.type === 'textarea' ? 'md:col-span-2' : ''}>
                <FormField label={campo.label} required={campo.required} error={errors[campo.key]}>
                  {campo.type === 'select' ? (
                    <Select value={form[campo.key] || ''} onChange={(e) => handleChange(campo.key, e.target.value)}>
                      <option value="">Seleccionar...</option>
                      {campo.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  ) : campo.type === 'textarea' ? (
                    <Textarea value={form[campo.key] || ''} onChange={(e) => handleChange(campo.key, e.target.value)} placeholder={campo.placeholder} />
                  ) : (
                    <Input value={form[campo.key] || ''} onChange={(e) => handleChange(campo.key, e.target.value)} placeholder={campo.placeholder} />
                  )}
                </FormField>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" icon={<Save size={16} />}>Crear {config.label.toLowerCase()}</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
