import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, CheckCircle, ArrowLeft, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  Hogar, Caracterizacion, SeccionCaracterizacion, DimensionCaracterizacion,
  RiesgoHogar, IntegranteHogar, PersonaMock,
} from '@/shared/types/domain'

const dimensionConfig: { key: DimensionCaracterizacion; label: string; preguntas: { id: string; label: string; tipo: 'boolean' | 'text' | 'number'; esRiesgo?: boolean }[] }[] = [
  {
    key: 'datos_vivienda', label: 'Datos de Vivienda',
    preguntas: [
      { id: 'pisosMaterial', label: 'Material de pisos', tipo: 'text' },
      { id: 'techoMaterial', label: 'Material del techo', tipo: 'text' },
      { id: 'aguaPotable', label: '¿Tiene agua potable?', tipo: 'boolean' },
      { id: 'alcantarillado', label: '¿Tiene alcantarillado?', tipo: 'boolean' },
      { id: 'recoleccionBasuras', label: '¿Tiene recolección de basuras?', tipo: 'boolean' },
    ],
  },
  {
    key: 'vida_saludable', label: 'Vida Saludable',
    preguntas: [
      { id: 'alimentacionBalanceada', label: '¿La familia tiene alimentación balanceada?', tipo: 'boolean', esRiesgo: true },
      { id: 'actividadFisica', label: '¿Realizan actividad física regular?', tipo: 'boolean', esRiesgo: true },
      { id: 'consumoFrutas', label: '¿Consumen frutas y verduras diariamente?', tipo: 'boolean', esRiesgo: true },
    ],
  },
  {
    key: 'salud_mental', label: 'Salud Mental',
    preguntas: [
      { id: 'antecedentesDepresion', label: '¿Algún integrante presenta síntomas de depresión?', tipo: 'boolean', esRiesgo: true },
      { id: 'violenciaIntrafamiliar', label: '¿Se identifica violencia intrafamiliar?', tipo: 'boolean', esRiesgo: true },
      { id: 'consumoSPA', label: '¿Algún integrante consume sustancias psicoactivas?', tipo: 'boolean', esRiesgo: true },
    ],
  },
  {
    key: 'convivencia_social', label: 'Convivencia Social',
    preguntas: [
      { id: 'relacionesVecinales', label: '¿Las relaciones vecinales son positivas?', tipo: 'boolean' },
      { id: 'participacionComunitaria', label: '¿Participan en actividades comunitarias?', tipo: 'boolean' },
      { id: 'redesApoyo', label: '¿Tienen redes de apoyo social?', tipo: 'boolean', esRiesgo: true },
    ],
  },
  {
    key: 'sexualidad', label: 'Sexualidad, Derechos Sexuales y Reproductivos',
    preguntas: [
      { id: 'planificacionFamiliar', label: '¿Usan métodos de planificación familiar?', tipo: 'boolean' },
      { id: 'controlPrenatal', label: '¿Hay gestantes con control prenatal?', tipo: 'boolean' },
      { id: 'its', label: '¿Algún integrante ha tenido ITS?', tipo: 'boolean', esRiesgo: true },
    ],
  },
  {
    key: 'seguridad_alimentaria', label: 'Seguridad Alimentaria',
    preguntas: [
      { id: 'accesoAlimentos', label: '¿Tienen acceso permanente a alimentos?', tipo: 'boolean', esRiesgo: true },
      { id: 'frecuenciaComidas', label: 'Número de comidas diarias', tipo: 'number' },
      { id: 'inseguridadAlimentaria', label: '¿Se identifica inseguridad alimentaria?', tipo: 'boolean', esRiesgo: true },
    ],
  },
]

export function CaracterizacionPage() {
  const { hogarId, carId } = useParams<{ hogarId: string; carId: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const isNew = carId === 'nueva'

  const [hogar, setHogar] = useState<Hogar | null>(null)
  const [caracterizacion, setCaracterizacion] = useState<Caracterizacion | null>(null)
  const [integrantes, setIntegrantes] = useState<(IntegranteHogar & { persona: PersonaMock | null })[]>([])
  const [activeSection, setActiveSection] = useState(0)

  // Riesgo en edición
  const [editingRiesgo, setEditingRiesgo] = useState<{ seccionIdx: number; descripcion: string; nivel: 'bajo' | 'medio' | 'alto'; afectados: string[] } | null>(null)

  const loadData = useCallback(() => {
    const hogares: Hogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]')
    setHogar(hogares.find((h) => h.id === hogarId) ?? null)

    const allInt: IntegranteHogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.integrantes) || '[]')
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    setIntegrantes(allInt.filter((i) => i.hogarId === hogarId).map((i) => ({ ...i, persona: personas.find((p) => p.id === i.personaId) ?? null })))

    if (isNew) {
      const now = new Date().toISOString()
      setCaracterizacion({
        id: `car${Date.now()}`, hogarId: hogarId!, fecha: new Date().toISOString().split('T')[0],
        profesional: usuario.nombre, estado: 'en_progreso',
        secciones: dimensionConfig.map((d) => ({ dimension: d.key, completada: false, respuestas: {}, riesgos: [] })),
        creadoPor: usuario.nombre, creadoEn: now, actualizadoPor: usuario.nombre, actualizadoEn: now,
      })
    } else {
      const cars: Caracterizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizaciones) || '[]')
      setCaracterizacion(cars.find((c) => c.id === carId) ?? null)
    }
  }, [hogarId, carId, isNew, usuario.nombre])

  useEffect(() => { loadData() }, [loadData])

  const saveCaracterizacion = (car: Caracterizacion) => {
    const cars: Caracterizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizaciones) || '[]')
    const idx = cars.findIndex((c) => c.id === car.id)
    if (idx >= 0) cars[idx] = car
    else cars.push(car)
    localStorage.setItem(STORAGE_KEYS.caracterizaciones, JSON.stringify(cars))
    setCaracterizacion(car)
  }

  const handleAnswer = (secIdx: number, pregId: string, value: string | boolean | number) => {
    if (!caracterizacion) return
    const updated = { ...caracterizacion, secciones: [...caracterizacion.secciones] }
    updated.secciones[secIdx] = { ...updated.secciones[secIdx], respuestas: { ...updated.secciones[secIdx].respuestas, [pregId]: value } }
    setCaracterizacion(updated)
  }

  const handleCompleteSection = (secIdx: number) => {
    if (!caracterizacion) return
    const updated = { ...caracterizacion, secciones: [...caracterizacion.secciones], actualizadoEn: new Date().toISOString() }
    updated.secciones[secIdx] = { ...updated.secciones[secIdx], completada: true }
    const allComplete = updated.secciones.every((s) => s.completada)
    if (allComplete) updated.estado = 'completada'
    saveCaracterizacion(updated)
    if (secIdx < dimensionConfig.length - 1) setActiveSection(secIdx + 1)
  }

  const handleAddRiesgo = (secIdx: number) => {
    if (!editingRiesgo || !caracterizacion) return
    const updated = { ...caracterizacion, secciones: [...caracterizacion.secciones] }
    const riesgo: RiesgoHogar = {
      id: `r${Date.now()}`, descripcion: editingRiesgo.descripcion,
      nivel: editingRiesgo.nivel, integrantesAfectados: editingRiesgo.afectados,
    }
    updated.secciones[secIdx] = { ...updated.secciones[secIdx], riesgos: [...updated.secciones[secIdx].riesgos, riesgo] }
    saveCaracterizacion(updated)
    setEditingRiesgo(null)
  }

  const handleSave = () => {
    if (!caracterizacion) return
    saveCaracterizacion({ ...caracterizacion, actualizadoEn: new Date().toISOString() })
    navigate(`/hogares/${hogarId}`)
  }

  if (!hogar || !caracterizacion) return <div className="p-8 text-center text-gray-500">No encontrado.</div>

  return (
    <div>
      <PageHeader
        title={isNew ? 'Nueva Caracterización' : `Caracterización ${caracterizacion.fecha}`}
        subtitle={`Hogar ${hogar.codigo} — ${hogar.direccion}`}
        breadcrumbs={[{ label: 'Entorno Hogar', to: '/hogares' }, { label: hogar.codigo, to: `/hogares/${hogarId}` }, { label: isNew ? 'Nueva' : caracterizacion.fecha }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(`/hogares/${hogarId}`)}>Volver</Button>
            <Button size="sm" icon={<Save size={14} />} onClick={handleSave}>Guardar y salir</Button>
          </div>
        }
      />

      {/* Progreso */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {dimensionConfig.map((d, i) => {
          const sec = caracterizacion.secciones[i]
          return (
            <button
              key={d.key}
              onClick={() => {
                // Solo permitir navegar a secciones previas completadas o la actual
                if (i === 0 || caracterizacion.secciones[i - 1]?.completada || sec?.completada) setActiveSection(i)
              }}
              disabled={i > 0 && !caracterizacion.secciones[i - 1]?.completada && !sec?.completada}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border ${
                activeSection === i ? 'bg-[var(--pyms-primary)] text-white border-[var(--pyms-primary)]'
                : sec?.completada ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-white text-gray-500 border-gray-200 disabled:opacity-40'
              }`}
            >
              {sec?.completada ? <CheckCircle size={14} /> : <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[12px]">{i + 1}</span>}
              {d.label}
            </button>
          )
        })}
      </div>

      {/* Sección activa */}
      {(() => {
        const dim = dimensionConfig[activeSection]
        const sec = caracterizacion.secciones[activeSection]
        const isLocked = sec.completada && caracterizacion.estado === 'completada'

        return (
          <Card title={dim.label} className="mb-6">
            {sec.completada && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 mb-4 flex items-center gap-2 text-sm text-green-700">
                <CheckCircle size={16} /> Sección completada
              </div>
            )}

            <div className="space-y-4">
              {dim.preguntas.map((preg) => {
                const val = sec.respuestas[preg.id]
                return (
                  <div key={preg.id} className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        {preg.label}
                        {preg.esRiesgo && <AlertTriangle size={12} className="text-yellow-500" />}
                      </label>
                      {preg.tipo === 'boolean' ? (
                        <div className="flex gap-3 mt-1">
                          <label className="flex items-center gap-1.5 text-sm">
                            <input type="radio" name={preg.id} checked={val === true} disabled={isLocked}
                              onChange={() => handleAnswer(activeSection, preg.id, true)} /> Sí
                          </label>
                          <label className="flex items-center gap-1.5 text-sm">
                            <input type="radio" name={preg.id} checked={val === false} disabled={isLocked}
                              onChange={() => handleAnswer(activeSection, preg.id, false)} /> No
                          </label>
                        </div>
                      ) : preg.tipo === 'number' ? (
                        <Input type="number" value={val as number ?? ''} disabled={isLocked}
                          onChange={(e) => handleAnswer(activeSection, preg.id, parseInt(e.target.value) || 0)} className="mt-1 max-w-[100px]" />
                      ) : (
                        <Input value={val as string ?? ''} disabled={isLocked}
                          onChange={(e) => handleAnswer(activeSection, preg.id, e.target.value)} className="mt-1" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Riesgos de la sección */}
            {sec.riesgos.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Riesgos identificados</h4>
                <div className="space-y-2">
                  {sec.riesgos.map((r) => (
                    <div key={r.id} className="rounded border p-3 bg-red-50 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={r.nivel === 'bajo' ? 'success' : r.nivel === 'medio' ? 'warning' : 'danger'}>{r.nivel}</Badge>
                        <span>{r.descripcion}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Afecta a: {r.integrantesAfectados.map((pid) => {
                          const int = integrantes.find((i) => i.personaId === pid)
                          return int?.persona ? `${int.persona.nombres} ${int.persona.apellidos}` : pid
                        }).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agregar riesgo */}
            {!isLocked && (
              <div className="mt-4 pt-4 border-t">
                {editingRiesgo?.seccionIdx === activeSection ? (
                  <div className="rounded-lg border p-4 space-y-3">
                    <FormField label="Descripción del riesgo" required>
                      <Input value={editingRiesgo.descripcion} onChange={(e) => setEditingRiesgo({ ...editingRiesgo, descripcion: e.target.value })} />
                    </FormField>
                    <FormField label="Nivel">
                      <Select value={editingRiesgo.nivel} onChange={(e) => setEditingRiesgo({ ...editingRiesgo, nivel: e.target.value as 'bajo' | 'medio' | 'alto' })}>
                        <option value="bajo">Bajo</option><option value="medio">Medio</option><option value="alto">Alto</option>
                      </Select>
                    </FormField>
                    <FormField label="Integrantes afectados">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {integrantes.map((int) => (
                          <label key={int.personaId} className="flex items-center gap-1.5 text-sm border rounded px-2 py-1">
                            <input type="checkbox" checked={editingRiesgo.afectados.includes(int.personaId)}
                              onChange={(e) => {
                                const af = e.target.checked
                                  ? [...editingRiesgo.afectados, int.personaId]
                                  : editingRiesgo.afectados.filter((a) => a !== int.personaId)
                                setEditingRiesgo({ ...editingRiesgo, afectados: af })
                              }} />
                            {int.persona ? `${int.persona.nombres} ${int.persona.apellidos}` : int.personaId}
                          </label>
                        ))}
                      </div>
                    </FormField>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAddRiesgo(activeSection)}>Agregar riesgo</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingRiesgo(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" icon={<AlertTriangle size={14} />}
                    onClick={() => setEditingRiesgo({ seccionIdx: activeSection, descripcion: '', nivel: 'medio', afectados: [] })}>
                    Registrar riesgo
                  </Button>
                )}
              </div>
            )}

            {/* Completar sección */}
            {!sec.completada && (
              <div className="flex justify-end mt-6 pt-4 border-t">
                <Button icon={<CheckCircle size={16} />} onClick={() => handleCompleteSection(activeSection)}>
                  Completar sección y continuar
                </Button>
              </div>
            )}
          </Card>
        )
      })()}
    </div>
  )
}
