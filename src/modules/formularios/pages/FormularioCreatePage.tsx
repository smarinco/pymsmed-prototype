import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  FormularioDinamico, SeccionFormulario, CampoDinamico,
  TipoCampoDinamico, Dimension,
} from '@/shared/types/domain'

const dimensionOptions: { value: Dimension; label: string }[] = [
  { value: 'vida_saludable', label: 'Vida Saludable' }, { value: 'salud_mental', label: 'Salud Mental' },
  { value: 'convivencia_social', label: 'Convivencia Social' }, { value: 'sexualidad', label: 'Sexualidad' },
  { value: 'seguridad_alimentaria', label: 'Seguridad Alimentaria' }, { value: 'salud_ambiental', label: 'Salud Ambiental' },
  { value: 'salud_bucal', label: 'Salud Bucal' },
]

const tiposCampo: { value: TipoCampoDinamico; label: string }[] = [
  { value: 'text', label: 'Texto' }, { value: 'number', label: 'Número' },
  { value: 'select', label: 'Lista desplegable' }, { value: 'radio', label: 'Opción única' },
  { value: 'checkbox', label: 'Casillas múltiples' }, { value: 'textarea', label: 'Texto largo' },
  { value: 'date', label: 'Fecha' },
]

const poblacionOptions = [
  { value: 'todos', label: 'Todos' }, { value: 'ninos', label: 'Niños' },
  { value: 'adolescentes', label: 'Adolescentes' }, { value: 'adultos', label: 'Adultos' },
  { value: 'gestantes', label: 'Gestantes' }, { value: 'adulto_mayor', label: 'Adulto mayor' },
]

const tipoRequiereOpciones = (tipo: TipoCampoDinamico) => ['select', 'radio', 'checkbox'].includes(tipo)

interface CampoEditable extends CampoDinamico {
  opcionesTexto: string // texto separado por líneas para editar
}

interface SeccionEditable extends Omit<SeccionFormulario, 'campos'> {
  campos: CampoEditable[]
  collapsed: boolean
}

function newCampo(): CampoEditable {
  return {
    id: `c${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    label: '', tipo: 'text', requerido: false,
    placeholder: '', ayuda: '', opcionesTexto: '',
  }
}

function newSeccion(): SeccionEditable {
  return {
    id: `s${Date.now()}`,
    titulo: '',
    descripcion: '',
    campos: [newCampo()],
    collapsed: false,
  }
}

export function FormularioCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [meta, setMeta] = useState({
    nombre: '', descripcion: '', dimension: 'vida_saludable' as Dimension, version: '1.0',
    aplicaA: ['todos'] as string[],
  })

  const [secciones, setSecciones] = useState<SeccionEditable[]>([newSeccion()])

  // --- Meta handlers ---
  const handleMetaChange = (k: string, v: string) => {
    setMeta((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  const togglePoblacion = (val: string) => {
    setMeta((p) => {
      if (val === 'todos') return { ...p, aplicaA: ['todos'] }
      let next = p.aplicaA.filter((a) => a !== 'todos')
      next = next.includes(val) ? next.filter((a) => a !== val) : [...next, val]
      return { ...p, aplicaA: next.length === 0 ? ['todos'] : next }
    })
  }

  // --- Seccion handlers ---
  const addSeccion = () => setSecciones((p) => [...p, newSeccion()])

  const removeSeccion = (idx: number) => {
    if (secciones.length <= 1) return
    setSecciones((p) => p.filter((_, i) => i !== idx))
  }

  const updateSeccion = (idx: number, field: string, value: string) => {
    setSecciones((p) => p.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const toggleCollapse = (idx: number) => {
    setSecciones((p) => p.map((s, i) => i === idx ? { ...s, collapsed: !s.collapsed } : s))
  }

  const moveSeccion = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= secciones.length) return
    setSecciones((p) => {
      const copy = [...p]
      ;[copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]]
      return copy
    })
  }

  // --- Campo handlers ---
  const addCampo = (secIdx: number) => {
    setSecciones((p) => p.map((s, i) =>
      i === secIdx ? { ...s, campos: [...s.campos, newCampo()] } : s
    ))
  }

  const removeCampo = (secIdx: number, campoIdx: number) => {
    setSecciones((p) => p.map((s, i) =>
      i === secIdx ? { ...s, campos: s.campos.filter((_, ci) => ci !== campoIdx) } : s
    ))
  }

  const updateCampo = (secIdx: number, campoIdx: number, field: string, value: string | boolean) => {
    setSecciones((p) => p.map((s, i) =>
      i === secIdx ? {
        ...s,
        campos: s.campos.map((c, ci) => ci === campoIdx ? { ...c, [field]: value } : c),
      } : s
    ))
  }

  // --- Save ---
  const handleSave = (estado: 'activo' | 'borrador') => {
    const errs: Record<string, string> = {}
    if (!meta.nombre.trim()) errs.nombre = 'Obligatorio'
    // Validar que al menos 1 sección tenga título y 1 campo con label
    let hasCampoValido = false
    secciones.forEach((sec, i) => {
      if (!sec.titulo.trim()) errs[`sec_${i}`] = 'La sección necesita un título'
      sec.campos.forEach((c) => { if (c.label.trim()) hasCampoValido = true })
    })
    if (!hasCampoValido) errs.campos = 'Agregue al menos un campo con nombre'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const all: FormularioDinamico[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.formularios) || '[]')
    const now = new Date().toISOString()

    const formulario: FormularioDinamico = {
      id: `fd${Date.now()}`,
      codigo: `FD-${String(all.length + 1).padStart(3, '0')}`,
      nombre: meta.nombre,
      version: meta.version,
      descripcion: meta.descripcion,
      dimension: meta.dimension,
      aplicaA: meta.aplicaA as FormularioDinamico['aplicaA'],
      estado,
      creadoEn: now,
      actualizadoEn: now,
      secciones: secciones.map((sec) => ({
        id: sec.id,
        titulo: sec.titulo,
        descripcion: sec.descripcion || undefined,
        campos: sec.campos
          .filter((c) => c.label.trim())
          .map((c) => ({
            id: c.id,
            label: c.label,
            tipo: c.tipo,
            requerido: c.requerido,
            placeholder: c.placeholder || undefined,
            ayuda: c.ayuda || undefined,
            opciones: tipoRequiereOpciones(c.tipo)
              ? c.opcionesTexto.split('\n').map((o) => o.trim()).filter(Boolean)
              : undefined,
          })),
      })),
    }

    all.push(formulario)
    localStorage.setItem(STORAGE_KEYS.formularios, JSON.stringify(all))
    navigate(`/formularios/${formulario.id}`)
  }

  const totalCampos = secciones.reduce((s, sec) => s + sec.campos.filter((c) => c.label.trim()).length, 0)

  return (
    <div>
      <PageHeader
        title="Crear Formulario Dinámico"
        subtitle="Diseñe la estructura de secciones y campos"
        breadcrumbs={[{ label: 'Formularios', to: '/formularios' }, { label: 'Crear' }]}
        actions={<Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/formularios')}>Cancelar</Button>}
      />

      {/* Meta */}
      <Card title="Datos generales" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField label="Nombre del formulario" required error={errors.nombre}>
              <Input value={meta.nombre} onChange={(e) => handleMetaChange('nombre', e.target.value)} placeholder="Ej: Tamizaje Auditivo Infantil" />
            </FormField>
          </div>
          <FormField label="Dimensión">
            <Select value={meta.dimension} onChange={(e) => handleMetaChange('dimension', e.target.value)}>
              {dimensionOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Versión">
            <Input value={meta.version} onChange={(e) => handleMetaChange('version', e.target.value)} />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Descripción">
              <Textarea value={meta.descripcion} onChange={(e) => handleMetaChange('descripcion', e.target.value)} placeholder="Describa el propósito del formulario..." />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Población objetivo</label>
            <div className="flex gap-2 flex-wrap">
              {poblacionOptions.map((o) => (
                <button key={o.value} type="button" onClick={() => togglePoblacion(o.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                    meta.aplicaA.includes(o.value) ? 'bg-[var(--pyms-primary)] text-white border-[var(--pyms-primary)]' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}>{o.label}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {errors.campos && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-800">{errors.campos}</div>
      )}

      {/* Secciones */}
      <div className="space-y-4 mb-6">
        {secciones.map((sec, secIdx) => (
          <div key={sec.id} className="rounded-lg border bg-white">
            {/* Header sección */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50 rounded-t-lg">
              <GripVertical size={16} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Sección {secIdx + 1}</span>
              <span className="flex-1 text-sm font-medium truncate">{sec.titulo || '(sin título)'}</span>
              <Badge variant="default">{sec.campos.filter((c) => c.label.trim()).length} campos</Badge>
              <div className="flex gap-1">
                <button onClick={() => moveSeccion(secIdx, -1)} disabled={secIdx === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronUp size={14} /></button>
                <button onClick={() => moveSeccion(secIdx, 1)} disabled={secIdx === secciones.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronDown size={14} /></button>
                <button onClick={() => toggleCollapse(secIdx)} className="p-1 rounded hover:bg-gray-200">
                  {sec.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
                <button onClick={() => removeSeccion(secIdx)} disabled={secciones.length <= 1} className="p-1 rounded hover:bg-red-100 text-red-500 disabled:opacity-30"><Trash2 size={14} /></button>
              </div>
            </div>

            {!sec.collapsed && (
              <div className="p-4">
                {/* Titulo sección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <FormField label="Título de la sección" required error={errors[`sec_${secIdx}`]}>
                    <Input value={sec.titulo} onChange={(e) => updateSeccion(secIdx, 'titulo', e.target.value)} placeholder="Ej: Evaluación visual" />
                  </FormField>
                  <FormField label="Descripción (opcional)">
                    <Input value={sec.descripcion || ''} onChange={(e) => updateSeccion(secIdx, 'descripcion', e.target.value)} placeholder="Instrucciones para esta sección" />
                  </FormField>
                </div>

                {/* Campos */}
                <div className="space-y-3">
                  {sec.campos.map((campo, campoIdx) => (
                    <div key={campo.id} className="rounded border p-3 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Label */}
                        <div className="md:col-span-4">
                          <FormField label="Nombre del campo">
                            <Input value={campo.label} onChange={(e) => updateCampo(secIdx, campoIdx, 'label', e.target.value)} placeholder="Ej: Agudeza visual OD" />
                          </FormField>
                        </div>
                        {/* Tipo */}
                        <div className="md:col-span-2">
                          <FormField label="Tipo">
                            <Select value={campo.tipo} onChange={(e) => updateCampo(secIdx, campoIdx, 'tipo', e.target.value)}>
                              {tiposCampo.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </Select>
                          </FormField>
                        </div>
                        {/* Placeholder */}
                        <div className="md:col-span-3">
                          <FormField label="Placeholder">
                            <Input value={campo.placeholder || ''} onChange={(e) => updateCampo(secIdx, campoIdx, 'placeholder', e.target.value)} />
                          </FormField>
                        </div>
                        {/* Requerido + acciones */}
                        <div className="md:col-span-3 flex items-end gap-2">
                          <label className="flex items-center gap-1.5 text-sm pb-2">
                            <input type="checkbox" checked={campo.requerido} onChange={(e) => updateCampo(secIdx, campoIdx, 'requerido', e.target.checked)} />
                            Requerido
                          </label>
                          <button onClick={() => removeCampo(secIdx, campoIdx)} className="p-1.5 rounded hover:bg-red-100 text-red-500 mb-1.5"><Trash2 size={14} /></button>
                        </div>
                        {/* Opciones (si aplica) */}
                        {tipoRequiereOpciones(campo.tipo) && (
                          <div className="md:col-span-6">
                            <FormField label="Opciones (una por línea)">
                              <Textarea value={campo.opcionesTexto} onChange={(e) => updateCampo(secIdx, campoIdx, 'opcionesTexto', e.target.value)}
                                placeholder={"Opción 1\nOpción 2\nOpción 3"} rows={3} />
                            </FormField>
                          </div>
                        )}
                        {/* Ayuda */}
                        <div className={tipoRequiereOpciones(campo.tipo) ? 'md:col-span-6' : 'md:col-span-12'}>
                          <FormField label="Texto de ayuda (opcional)">
                            <Input value={campo.ayuda || ''} onChange={(e) => updateCampo(secIdx, campoIdx, 'ayuda', e.target.value)} placeholder="Instrucción o tooltip" />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" size="sm" icon={<Plus size={14} />} className="mt-3" onClick={() => addCampo(secIdx)}>
                  Agregar campo
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button variant="secondary" icon={<Plus size={16} />} className="mb-6" onClick={addSeccion}>
        Agregar sección
      </Button>

      {/* Resumen y guardar */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {secciones.length} sección(es) • {totalCampos} campo(s)
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => handleSave('borrador')}>Guardar como borrador</Button>
            <Button icon={<Save size={16} />} onClick={() => handleSave('activo')}>Publicar formulario</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
