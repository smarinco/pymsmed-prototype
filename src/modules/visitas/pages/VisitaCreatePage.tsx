import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EntornoComunitario, Visita, Dimension, CreateVisitaInput } from '@/shared/types/domain'

const dimensionOptions: { value: Dimension; label: string }[] = [
  { value: 'vida_saludable', label: 'Vida Saludable' },
  { value: 'salud_mental', label: 'Salud Mental' },
  { value: 'convivencia_social', label: 'Convivencia Social' },
  { value: 'sexualidad', label: 'Sexualidad' },
  { value: 'seguridad_alimentaria', label: 'Seguridad Alimentaria' },
  { value: 'salud_ambiental', label: 'Salud Ambiental' },
  { value: 'salud_bucal', label: 'Salud Bucal' },
]

export function VisitaCreatePage() {
  const { entornoId } = useParams<{ entornoId: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [entorno, setEntorno] = useState<EntornoComunitario | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<CreateVisitaInput>({
    entornoId: entornoId || '',
    fecha: new Date().toISOString().split('T')[0],
    dimension: 'vida_saludable',
    proyecto: 'PYMS Medellín',
    profesionalResponsable: usuario.nombre,
    lugar: '',
    observaciones: '',
  })

  useEffect(() => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const found = entornos.find((e) => e.id === entornoId) ?? null
    setEntorno(found)
    if (found) {
      setForm((prev) => ({ ...prev, lugar: found.nombre, entornoId: found.id }))
    }
  }, [entornoId])

  const handleChange = (field: keyof CreateVisitaInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.fecha) newErrors.fecha = 'La fecha es obligatoria.'
    if (!form.profesionalResponsable.trim()) newErrors.profesionalResponsable = 'El profesional es obligatorio.'
    if (!form.lugar.trim()) newErrors.lugar = 'El lugar es obligatorio.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const now = new Date().toISOString()

    const nueva: Visita = {
      id: `v${Date.now()}`,
      ...form,
      estado: 'abierta',
      creadoPor: usuario.nombre,
      creadoEn: now,
      actualizadoPor: usuario.nombre,
      actualizadoEn: now,
    }

    visitas.push(nueva)
    localStorage.setItem(STORAGE_KEYS.visitas, JSON.stringify(visitas))
    navigate(`/visitas/${nueva.id}`)
  }

  if (!entorno) {
    return <div className="p-8 text-center text-gray-500">Entorno no encontrado.</div>
  }

  return (
    <div>
      <PageHeader
        title="Nueva Visita"
        subtitle={`Entorno: ${entorno.nombre}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
          { label: entorno.nombre, to: `/entornos/comunitario/${entornoId}` },
          { label: 'Nueva visita' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card title="Datos de la visita">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Fecha de visita" required error={errors.fecha}>
              <Input type="date" value={form.fecha} onChange={(e) => handleChange('fecha', e.target.value)} />
            </FormField>

            <FormField label="Dimensión" required>
              <Select value={form.dimension} onChange={(e) => handleChange('dimension', e.target.value)}>
                {dimensionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Proyecto" required>
              <Input value={form.proyecto} onChange={(e) => handleChange('proyecto', e.target.value)} />
            </FormField>

            <FormField label="Profesional responsable" required error={errors.profesionalResponsable}>
              <Input
                value={form.profesionalResponsable}
                onChange={(e) => handleChange('profesionalResponsable', e.target.value)}
              />
            </FormField>

            <FormField label="Lugar" required error={errors.lugar}>
              <Input value={form.lugar} onChange={(e) => handleChange('lugar', e.target.value)} />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Observaciones">
                <Textarea
                  value={form.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  placeholder="Notas sobre la jornada..."
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" icon={<Save size={16} />}>
              Crear visita
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
