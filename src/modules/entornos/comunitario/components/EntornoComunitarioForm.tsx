import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import type { EntornoComunitario, CreateEntornoInput, TipoEspacioComunitario } from '@/shared/types/domain'

const tipoEspacioOptions: { value: TipoEspacioComunitario; label: string }[] = [
  { value: 'centro_comunitario', label: 'Centro Comunitario' },
  { value: 'parque', label: 'Parque' },
  { value: 'cancha', label: 'Cancha' },
  { value: 'salon_comunal', label: 'Salón Comunal' },
  { value: 'iglesia', label: 'Iglesia' },
  { value: 'sede_social', label: 'Sede Social' },
  { value: 'espacio_publico', label: 'Espacio Público' },
  { value: 'otro', label: 'Otro' },
]

const comunas = [
  '1 - Popular', '2 - Santa Cruz', '3 - Manrique', '4 - Aranjuez',
  '5 - Castilla', '6 - Doce de Octubre', '7 - Robledo', '8 - Villa Hermosa',
  '9 - Buenos Aires', '10 - La Candelaria', '11 - Laureles-Estadio',
  '12 - La América', '13 - San Javier', '14 - El Poblado',
  '15 - Guayabal', '16 - Belén',
]

interface EntornoComunitarioFormProps {
  initialData?: EntornoComunitario
  onSubmit: (data: CreateEntornoInput) => void
  isEdit?: boolean
}

export function EntornoComunitarioForm({ initialData, onSubmit, isEdit = false }: EntornoComunitarioFormProps) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<CreateEntornoInput>({
    nombre: '',
    tipoEspacio: 'centro_comunitario',
    comuna: '',
    barrio: '',
    direccion: '',
    referenteComunitario: '',
    telefonoContacto: '',
    observaciones: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre,
        tipoEspacio: initialData.tipoEspacio,
        comuna: initialData.comuna,
        barrio: initialData.barrio,
        direccion: initialData.direccion,
        referenteComunitario: initialData.referenteComunitario,
        telefonoContacto: initialData.telefonoContacto,
        observaciones: initialData.observaciones,
      })
    }
  }, [initialData])

  const handleChange = (field: keyof CreateEntornoInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.'
    if (!form.comuna) newErrors.comuna = 'Seleccione una comuna.'
    if (!form.barrio.trim()) newErrors.barrio = 'El barrio es obligatorio.'
    if (!form.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria.'
    if (!form.referenteComunitario.trim()) newErrors.referenteComunitario = 'El referente es obligatorio.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card title={isEdit ? 'Editar información del entorno' : 'Información del nuevo entorno'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Nombre del entorno o punto comunitario" required error={errors.nombre}>
            <Input
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Centro Comunitario La Esperanza"
            />
          </FormField>

          <FormField label="Tipo de espacio comunitario" required>
            <Select
              value={form.tipoEspacio}
              onChange={(e) => handleChange('tipoEspacio', e.target.value)}
            >
              {tipoEspacioOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Comuna" required error={errors.comuna}>
            <Select value={form.comuna} onChange={(e) => handleChange('comuna', e.target.value)}>
              <option value="">Seleccionar comuna...</option>
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Barrio" required error={errors.barrio}>
            <Input
              value={form.barrio}
              onChange={(e) => handleChange('barrio', e.target.value)}
              placeholder="Ej: Santo Domingo"
            />
          </FormField>

          <FormField label="Dirección" required error={errors.direccion}>
            <Input
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Ej: Cra 32 #107-20"
            />
          </FormField>

          <FormField label="Referente comunitario" required error={errors.referenteComunitario}>
            <Input
              value={form.referenteComunitario}
              onChange={(e) => handleChange('referenteComunitario', e.target.value)}
              placeholder="Nombre del referente"
            />
          </FormField>

          <FormField label="Teléfono de contacto">
            <Input
              value={form.telefonoContacto}
              onChange={(e) => handleChange('telefonoContacto', e.target.value)}
              placeholder="Ej: 3101234567"
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Observaciones">
              <Textarea
                value={form.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Información adicional sobre el espacio..."
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button type="button" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" icon={<Save size={16} />}>
            {isEdit ? 'Guardar cambios' : 'Crear entorno'}
          </Button>
        </div>
      </Card>
    </form>
  )
}
