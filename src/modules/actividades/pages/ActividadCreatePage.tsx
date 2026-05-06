import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { ActividadColectiva, TipoActividad, Dimension } from '@/shared/types/domain'

const tipoOptions: { value: TipoActividad; label: string }[] = [
  { value: 'taller', label: 'Taller' }, { value: 'jornada_salud', label: 'Jornada de Salud' },
  { value: 'charla', label: 'Charla' }, { value: 'capacitacion', label: 'Capacitación' },
  { value: 'encuentro_comunitario', label: 'Encuentro Comunitario' }, { value: 'brigada', label: 'Brigada' },
  { value: 'otro', label: 'Otro' },
]
const dimOptions: { value: Dimension; label: string }[] = [
  { value: 'vida_saludable', label: 'Vida Saludable' }, { value: 'salud_mental', label: 'Salud Mental' },
  { value: 'convivencia_social', label: 'Convivencia Social' }, { value: 'sexualidad', label: 'Sexualidad' },
  { value: 'seguridad_alimentaria', label: 'Seguridad Alimentaria' }, { value: 'salud_ambiental', label: 'Salud Ambiental' },
  { value: 'salud_bucal', label: 'Salud Bucal' },
]

export function ActividadCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    titulo: '', tipoActividad: 'taller' as TipoActividad, dimension: 'vida_saludable' as Dimension,
    proyecto: 'PYMS Medellín', fechaProgramada: '', horario: '', lugar: '',
    profesionalResponsable: usuario.nombre, descripcion: '', participantesEsperados: '',
  })

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.titulo.trim()) errs.titulo = 'Obligatorio'
    if (!form.fechaProgramada) errs.fechaProgramada = 'Obligatorio'
    if (!form.lugar.trim()) errs.lugar = 'Obligatorio'
    if (!form.participantesEsperados) errs.participantesEsperados = 'Obligatorio'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const all: ActividadColectiva[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.actividades) || '[]')
    const now = new Date().toISOString()
    const nuevo: ActividadColectiva = {
      id: `ac${Date.now()}`, codigo: `AC-${String(all.length + 1).padStart(3, '0')}`,
      ...form, participantesEsperados: parseInt(form.participantesEsperados), estado: 'programada',
      creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    all.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.actividades, JSON.stringify(all))
    navigate(`/actividades/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader title="Programar Actividad" breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Actividades', to: '/actividades' }, { label: 'Nueva' }]} />
      <form onSubmit={handleSubmit}>
        <Card title="Datos de la actividad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormField label="Título" required error={errors.titulo}>
                <Input value={form.titulo} onChange={(e) => handleChange('titulo', e.target.value)} placeholder="Ej: Jornada de Tamizaje Nutricional" />
              </FormField>
            </div>
            <FormField label="Tipo de actividad"><Select value={form.tipoActividad} onChange={(e) => handleChange('tipoActividad', e.target.value)}>{tipoOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></FormField>
            <FormField label="Dimensión"><Select value={form.dimension} onChange={(e) => handleChange('dimension', e.target.value)}>{dimOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></FormField>
            <FormField label="Proyecto"><Input value={form.proyecto} onChange={(e) => handleChange('proyecto', e.target.value)} /></FormField>
            <FormField label="Profesional responsable"><Input value={form.profesionalResponsable} onChange={(e) => handleChange('profesionalResponsable', e.target.value)} /></FormField>
            <FormField label="Fecha programada" required error={errors.fechaProgramada}><Input type="date" value={form.fechaProgramada} onChange={(e) => handleChange('fechaProgramada', e.target.value)} /></FormField>
            <FormField label="Horario"><Input value={form.horario} onChange={(e) => handleChange('horario', e.target.value)} placeholder="Ej: 8:00 - 12:00" /></FormField>
            <FormField label="Lugar" required error={errors.lugar}><Input value={form.lugar} onChange={(e) => handleChange('lugar', e.target.value)} /></FormField>
            <FormField label="Participantes esperados" required error={errors.participantesEsperados}><Input type="number" value={form.participantesEsperados} onChange={(e) => handleChange('participantesEsperados', e.target.value)} /></FormField>
            <div className="md:col-span-2"><FormField label="Descripción"><Textarea value={form.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} placeholder="Descripción de la actividad..." /></FormField></div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" icon={<Save size={16} />}>Programar actividad</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
