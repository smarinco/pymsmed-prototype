import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { FormularioDinamico, RespuestaFormulario, CampoDinamico } from '@/shared/types/domain'

const inputBase = 'w-full rounded-lg border px-3 py-2 text-sm focus:border-[var(--pyms-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pyms-secondary)]'

function DynamicField({ campo, value, onChange }: { campo: CampoDinamico; value: string | undefined; onChange: (v: string) => void }) {
  switch (campo.tipo) {
    case 'text':
    case 'date':
      return <input type={campo.tipo} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={campo.placeholder} className={inputBase} />
    case 'number':
      return <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={campo.placeholder} className={inputBase} />
    case 'textarea':
      return <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={campo.placeholder} rows={3} className={`${inputBase} resize-none`} />
    case 'select':
      return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputBase}>
          <option value="">Seleccionar...</option>
          {campo.opciones?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    case 'radio':
      return (
        <div className="flex gap-4 mt-1">
          {campo.opciones?.map((o) => (
            <label key={o} className="flex items-center gap-1.5 text-sm">
              <input type="radio" name={campo.id} checked={value === o} onChange={() => onChange(o)} />
              {o}
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="flex gap-3 flex-wrap mt-1">
          {campo.opciones?.map((o) => {
            const selected = (value ?? '').split(',').filter(Boolean)
            const checked = selected.includes(o)
            return (
              <label key={o} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={checked}
                  onChange={() => {
                    const next = checked ? selected.filter((s) => s !== o) : [...selected, o]
                    onChange(next.join(','))
                  }} />
                {o}
              </label>
            )
          })}
        </div>
      )
    default:
      return <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputBase} />
  }
}

export function FormularioEjecutarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [form, setForm] = useState<FormularioDinamico | null>(null)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [guardado, setGuardado] = useState(false)
  const [errors, setErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const formularios: FormularioDinamico[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.formularios) || '[]')
    setForm(formularios.find((f) => f.id === id) ?? null)
  }, [id])

  const handleChange = (campoId: string, value: string) => {
    setRespuestas((p) => ({ ...p, [campoId]: value }))
    if (errors.has(campoId)) setErrors((p) => { const n = new Set(p); n.delete(campoId); return n })
  }

  const handleSave = () => {
    if (!form) return

    // Validar requeridos
    const newErrors = new Set<string>()
    form.secciones.forEach((sec) => {
      sec.campos.forEach((campo) => {
        if (campo.requerido && !respuestas[campo.id]?.trim()) newErrors.add(campo.id)
      })
    })

    if (newErrors.size > 0) {
      setErrors(newErrors)
      return
    }

    const all: RespuestaFormulario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.respuestasFormulario) || '[]')
    const now = new Date().toISOString()
    const nueva: RespuestaFormulario = {
      id: `rf${Date.now()}`, formularioId: id!, personaId: 'p1', // TODO: selector de persona
      respuestas, completado: true, fecha: new Date().toISOString().split('T')[0],
      creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
    }
    all.push(nueva)
    localStorage.setItem(STORAGE_KEYS.respuestasFormulario, JSON.stringify(all))
    setGuardado(true)
  }

  if (!form) return <div className="p-8 text-center text-gray-500">Formulario no encontrado.</div>

  if (guardado) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Formulario guardado</h2>
        <p className="text-sm text-gray-500 mb-6">Las respuestas de "{form.nombre}" han sido registradas.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/formularios/${id}`)}>Ver formulario</Button>
          <Button onClick={() => navigate('/formularios')}>Volver al catálogo</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Ejecutar: ${form.nombre}`}
        subtitle={`v${form.version} — ${form.secciones.reduce((s, sec) => s + sec.campos.length, 0)} campos`}
        breadcrumbs={[{ label: 'Formularios', to: '/formularios' }, { label: form.nombre, to: `/formularios/${id}` }, { label: 'Ejecutar' }]}
        actions={<Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>Cancelar</Button>}
      />

      <p className="text-sm text-gray-600 mb-6">{form.descripcion}</p>

      {errors.size > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-800">
          Hay {errors.size} campo(s) obligatorio(s) sin completar.
        </div>
      )}

      <div className="space-y-6">
        {form.secciones.map((sec, i) => (
          <Card key={sec.id} title={`${i + 1}. ${sec.titulo}`}>
            {sec.descripcion && <p className="text-xs text-gray-500 mb-4">{sec.descripcion}</p>}
            <div className="space-y-4">
              {sec.campos.map((campo) => (
                <div key={campo.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {campo.label}
                    {campo.requerido && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {campo.ayuda && <p className="text-xs text-gray-400 mb-1">{campo.ayuda}</p>}
                  <DynamicField campo={campo} value={respuestas[campo.id]} onChange={(v) => handleChange(campo.id, v)} />
                  {errors.has(campo.id) && <p className="text-xs text-red-600 mt-1">Este campo es obligatorio.</p>}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
        <Button icon={<Save size={16} />} onClick={handleSave}>Guardar respuestas</Button>
      </div>
    </div>
  )
}
