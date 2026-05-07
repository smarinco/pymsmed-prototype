import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EmpresaSalaAmiga } from '@/shared/types/domain'

const comunas = [
  '1 - Popular', '2 - Santa Cruz', '3 - Manrique', '4 - Aranjuez',
  '5 - Castilla', '6 - Doce de Octubre', '7 - Robledo', '8 - Villa Hermosa',
  '9 - Buenos Aires', '10 - La Candelaria', '11 - Laureles-Estadio',
  '12 - La América', '13 - San Javier', '14 - El Poblado', '15 - Guayabal', '16 - Belén',
]

export function SalaAmigaCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nombreEmpresa: '', nit: '', sectorEconomico: '', comuna: '', barrio: '', direccion: '',
    contactoNombre: '', contactoCargo: '', contactoTelefono: '',
    numTrabajadores: '', numMujeresEdadFertil: '', observaciones: '',
  })

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.nombreEmpresa.trim()) errs.nombreEmpresa = 'Obligatorio'
    if (!form.comuna) errs.comuna = 'Obligatorio'
    if (!form.direccion.trim()) errs.direccion = 'Obligatorio'
    if (!form.contactoNombre.trim()) errs.contactoNombre = 'Obligatorio'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const all: EmpresaSalaAmiga[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.empresasSala) || '[]')
    const now = new Date().toISOString()
    const nuevo: EmpresaSalaAmiga = {
      id: `sa${Date.now()}`, codigo: `SAL-${String(all.length + 1).padStart(3, '0')}`,
      nombreEmpresa: form.nombreEmpresa, nit: form.nit, sectorEconomico: form.sectorEconomico,
      comuna: form.comuna, barrio: form.barrio, direccion: form.direccion,
      contactoNombre: form.contactoNombre, contactoCargo: form.contactoCargo, contactoTelefono: form.contactoTelefono,
      numTrabajadores: parseInt(form.numTrabajadores) || 0, numMujeresEdadFertil: parseInt(form.numMujeresEdadFertil) || 0,
      estado: 'identificada', tieneSalaAmiga: false, observaciones: form.observaciones,
      creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    all.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.empresasSala, JSON.stringify(all))
    navigate(`/salas-amigas/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader title="Nueva Empresa" breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Salas Amigas', to: '/salas-amigas' }, { label: 'Nueva' }]} />
      <form onSubmit={handleSubmit}>
        <Card title="Datos de la empresa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Nombre de la empresa" required error={errors.nombreEmpresa}><Input value={form.nombreEmpresa} onChange={(e) => handleChange('nombreEmpresa', e.target.value)} /></FormField>
            <FormField label="NIT"><Input value={form.nit} onChange={(e) => handleChange('nit', e.target.value)} placeholder="900.123.456-7" /></FormField>
            <FormField label="Sector económico"><Input value={form.sectorEconomico} onChange={(e) => handleChange('sectorEconomico', e.target.value)} /></FormField>
            <FormField label="Comuna" required error={errors.comuna}><Select value={form.comuna} onChange={(e) => handleChange('comuna', e.target.value)}><option value="">Seleccionar...</option>{comunas.map((c) => <option key={c} value={c}>{c}</option>)}</Select></FormField>
            <FormField label="Barrio"><Input value={form.barrio} onChange={(e) => handleChange('barrio', e.target.value)} /></FormField>
            <FormField label="Dirección" required error={errors.direccion}><Input value={form.direccion} onChange={(e) => handleChange('direccion', e.target.value)} /></FormField>
            <FormField label="Nombre contacto" required error={errors.contactoNombre}><Input value={form.contactoNombre} onChange={(e) => handleChange('contactoNombre', e.target.value)} /></FormField>
            <FormField label="Cargo contacto"><Input value={form.contactoCargo} onChange={(e) => handleChange('contactoCargo', e.target.value)} /></FormField>
            <FormField label="Teléfono contacto"><Input value={form.contactoTelefono} onChange={(e) => handleChange('contactoTelefono', e.target.value)} /></FormField>
            <FormField label="Número de trabajadores"><Input type="number" value={form.numTrabajadores} onChange={(e) => handleChange('numTrabajadores', e.target.value)} /></FormField>
            <FormField label="Mujeres en edad fértil"><Input type="number" value={form.numMujeresEdadFertil} onChange={(e) => handleChange('numMujeresEdadFertil', e.target.value)} /></FormField>
            <div className="md:col-span-2"><FormField label="Observaciones"><Textarea value={form.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} /></FormField></div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" icon={<Save size={16} />}>Registrar empresa</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
