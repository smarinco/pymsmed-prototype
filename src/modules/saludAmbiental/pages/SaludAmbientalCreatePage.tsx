import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { CaracterizacionAmbiental } from '@/shared/types/domain'

const comunas = [
  '1 - Popular', '2 - Santa Cruz', '3 - Manrique', '4 - Aranjuez',
  '5 - Castilla', '6 - Doce de Octubre', '7 - Robledo', '8 - Villa Hermosa',
  '9 - Buenos Aires', '10 - La Candelaria', '11 - Laureles-Estadio',
  '12 - La América', '13 - San Javier', '14 - El Poblado', '15 - Guayabal', '16 - Belén',
]

export function SaludAmbientalCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    ubicacion: '', comuna: '', barrio: '',
    tipoZona: 'residencial' as CaracterizacionAmbiental['tipoZona'],
  })

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.ubicacion.trim()) errs.ubicacion = 'Obligatorio'
    if (!form.comuna) errs.comuna = 'Obligatorio'
    if (!form.barrio.trim()) errs.barrio = 'Obligatorio'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const all: CaracterizacionAmbiental[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizacionesAmbientales) || '[]')
    const now = new Date().toISOString()
    const dimensions = ['agua_saneamiento', 'residuos_solidos', 'vectores_plagas', 'calidad_aire', 'suelo_vivienda'] as const

    const nuevo: CaracterizacionAmbiental = {
      id: `ca${Date.now()}`,
      codigo: `SA-${String(all.length + 1).padStart(3, '0')}`,
      ubicacion: form.ubicacion, comuna: form.comuna, barrio: form.barrio, tipoZona: form.tipoZona,
      profesional: usuario.nombre, fecha: new Date().toISOString().split('T')[0],
      estado: 'en_progreso',
      secciones: dimensions.map((d) => ({ dimension: d, completada: false, respuestas: {}, nivelRiesgo: 'sin_riesgo' as const, observaciones: '' })),
      riesgoGeneral: 'sin_riesgo',
      recomendaciones: '',
      creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    all.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.caracterizacionesAmbientales, JSON.stringify(all))
    navigate(`/salud-ambiental/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader
        title="Nueva Caracterización Ambiental"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Salud Ambiental', to: '/salud-ambiental' }, { label: 'Nueva' }]}
      />
      <form onSubmit={handleSubmit}>
        <Card title="Datos de la zona a caracterizar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormField label="Ubicación / Descripción de la zona" required error={errors.ubicacion}>
                <Input value={form.ubicacion} onChange={(e) => handleChange('ubicacion', e.target.value)} placeholder="Ej: Quebrada La Herrera - Tramo zona 1" />
              </FormField>
            </div>
            <FormField label="Comuna" required error={errors.comuna}>
              <Select value={form.comuna} onChange={(e) => handleChange('comuna', e.target.value)}>
                <option value="">Seleccionar...</option>
                {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Barrio" required error={errors.barrio}>
              <Input value={form.barrio} onChange={(e) => handleChange('barrio', e.target.value)} />
            </FormField>
            <FormField label="Tipo de zona">
              <Select value={form.tipoZona} onChange={(e) => handleChange('tipoZona', e.target.value)}>
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
                <option value="rural">Rural</option>
                <option value="mixta">Mixta</option>
              </Select>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" icon={<Save size={16} />}>Crear caracterización</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
