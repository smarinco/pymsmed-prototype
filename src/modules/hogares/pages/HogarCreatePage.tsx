import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Hogar, TipoVivienda, TenenciaVivienda } from '@/shared/types/domain'

const comunas = [
  '1 - Popular', '2 - Santa Cruz', '3 - Manrique', '4 - Aranjuez',
  '5 - Castilla', '6 - Doce de Octubre', '7 - Robledo', '8 - Villa Hermosa',
  '9 - Buenos Aires', '10 - La Candelaria', '11 - Laureles-Estadio',
  '12 - La América', '13 - San Javier', '14 - El Poblado', '15 - Guayabal', '16 - Belén',
]

export function HogarCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    direccion: '', comuna: '', barrio: '', estrato: '1',
    tipoVivienda: 'casa' as TipoVivienda, tenencia: 'arrendada' as TenenciaVivienda,
    telefono: '', observaciones: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.direccion.trim()) newErrors.direccion = 'Obligatorio'
    if (!form.comuna) newErrors.comuna = 'Obligatorio'
    if (!form.barrio.trim()) newErrors.barrio = 'Obligatorio'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const hogares: Hogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]')
    const now = new Date().toISOString()
    const nuevo: Hogar = {
      id: `h${Date.now()}`, codigo: `HG-${String(hogares.length + 1).padStart(3, '0')}`,
      direccion: form.direccion, comuna: form.comuna, barrio: form.barrio,
      estrato: parseInt(form.estrato), tipoVivienda: form.tipoVivienda, tenencia: form.tenencia,
      telefono: form.telefono, observaciones: form.observaciones, estado: 'activo',
      creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    hogares.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.hogares, JSON.stringify(hogares))
    navigate(`/hogares/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader title="Nuevo Hogar" breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Entorno Hogar', to: '/hogares' }, { label: 'Nuevo' }]} />
      <form onSubmit={handleSubmit}>
        <Card title="Datos del hogar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Dirección" required error={errors.direccion}>
              <Input value={form.direccion} onChange={(e) => handleChange('direccion', e.target.value)} placeholder="Cra 32 #105-15" />
            </FormField>
            <FormField label="Comuna" required error={errors.comuna}>
              <Select value={form.comuna} onChange={(e) => handleChange('comuna', e.target.value)}>
                <option value="">Seleccionar...</option>
                {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Barrio" required error={errors.barrio}>
              <Input value={form.barrio} onChange={(e) => handleChange('barrio', e.target.value)} />
            </FormField>
            <FormField label="Estrato">
              <Select value={form.estrato} onChange={(e) => handleChange('estrato', e.target.value)}>
                {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </FormField>
            <FormField label="Tipo de vivienda">
              <Select value={form.tipoVivienda} onChange={(e) => handleChange('tipoVivienda', e.target.value)}>
                <option value="casa">Casa</option><option value="apartamento">Apartamento</option>
                <option value="habitacion">Habitación</option><option value="inquilinato">Inquilinato</option><option value="otro">Otro</option>
              </Select>
            </FormField>
            <FormField label="Tenencia">
              <Select value={form.tenencia} onChange={(e) => handleChange('tenencia', e.target.value)}>
                <option value="propia">Propia</option><option value="arrendada">Arrendada</option>
                <option value="familiar">Familiar</option><option value="invasion">Invasión</option><option value="otra">Otra</option>
              </Select>
            </FormField>
            <FormField label="Teléfono"><Input value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} /></FormField>
            <div className="md:col-span-2">
              <FormField label="Observaciones"><Textarea value={form.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} /></FormField>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" icon={<Save size={16} />}>Crear hogar</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
