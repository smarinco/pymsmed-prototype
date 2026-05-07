import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { ActivoTerritorial, CategoriaActivo } from '@/shared/types/domain'

const comunas = [
  '1 - Popular', '2 - Santa Cruz', '3 - Manrique', '4 - Aranjuez',
  '5 - Castilla', '6 - Doce de Octubre', '7 - Robledo', '8 - Villa Hermosa',
  '9 - Buenos Aires', '10 - La Candelaria', '11 - Laureles-Estadio',
  '12 - La América', '13 - San Javier', '14 - El Poblado', '15 - Guayabal', '16 - Belén',
]
const catOptions: { value: CategoriaActivo; label: string }[] = [
  { value: 'salud', label: 'Salud' }, { value: 'educacion', label: 'Educación' },
  { value: 'recreacion', label: 'Recreación' }, { value: 'comunitario', label: 'Comunitario' },
  { value: 'institucional', label: 'Institucional' }, { value: 'cultural', label: 'Cultural' },
  { value: 'ambiental', label: 'Ambiental' }, { value: 'economico', label: 'Económico' },
]

export function ActivoCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nombre: '', categoria: 'comunitario' as CategoriaActivo,
    comuna: '', barrio: '', direccion: '', descripcion: '',
    responsable: '', telefono: '', observaciones: '',
  })

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.nombre.trim()) errs.nombre = 'Obligatorio'
    if (!form.comuna) errs.comuna = 'Obligatorio'
    if (!form.barrio.trim()) errs.barrio = 'Obligatorio'
    if (!form.direccion.trim()) errs.direccion = 'Obligatorio'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const all: ActivoTerritorial[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.activos) || '[]')
    const now = new Date().toISOString()
    const nuevo: ActivoTerritorial = {
      id: `act${Date.now()}`, codigo: `AT-${String(all.length + 1).padStart(3, '0')}`,
      ...form, estado: 'activo', jornadasAsociadas: [],
      creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    all.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.activos, JSON.stringify(all))
    navigate(`/mapeo-activos/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader title="Nuevo Activo Territorial" breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Mapeo de Activos', to: '/mapeo-activos' }, { label: 'Nuevo' }]} />
      <form onSubmit={handleSubmit}>
        <Card title="Datos del activo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2"><FormField label="Nombre" required error={errors.nombre}><Input value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} placeholder="Ej: Centro de Salud Santo Domingo" /></FormField></div>
            <FormField label="Categoría"><Select value={form.categoria} onChange={(e) => handleChange('categoria', e.target.value)}>{catOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></FormField>
            <FormField label="Comuna" required error={errors.comuna}><Select value={form.comuna} onChange={(e) => handleChange('comuna', e.target.value)}><option value="">Seleccionar...</option>{comunas.map((c) => <option key={c} value={c}>{c}</option>)}</Select></FormField>
            <FormField label="Barrio" required error={errors.barrio}><Input value={form.barrio} onChange={(e) => handleChange('barrio', e.target.value)} /></FormField>
            <FormField label="Dirección" required error={errors.direccion}><Input value={form.direccion} onChange={(e) => handleChange('direccion', e.target.value)} /></FormField>
            <FormField label="Responsable"><Input value={form.responsable} onChange={(e) => handleChange('responsable', e.target.value)} /></FormField>
            <FormField label="Teléfono"><Input value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} /></FormField>
            <div className="md:col-span-2"><FormField label="Descripción"><Textarea value={form.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} placeholder="Descripción del activo..." /></FormField></div>
            <div className="md:col-span-2"><FormField label="Observaciones"><Textarea value={form.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} /></FormField></div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" icon={<Save size={16} />}>Crear activo</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
