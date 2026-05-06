import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, CheckCircle, Plus } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { TrafficLight } from '@/shared/components/TrafficLight'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  Visita,
  PersonaMock,
  Participante,
  Atencion,
  TipoAtencion,
  Dimension,
  EstadoSemaforo,
  CreateAtencionInput,
} from '@/shared/types/domain'

const tipoAtencionOptions: { value: TipoAtencion; label: string }[] = [
  { value: 'tamizaje', label: 'Tamizaje' },
  { value: 'consejeria', label: 'Consejería' },
  { value: 'educacion_salud', label: 'Educación en Salud' },
  { value: 'valoracion', label: 'Valoración' },
  { value: 'remision', label: 'Remisión' },
]

const dimensionOptions: { value: Dimension; label: string }[] = [
  { value: 'vida_saludable', label: 'Vida Saludable' },
  { value: 'salud_mental', label: 'Salud Mental' },
  { value: 'convivencia_social', label: 'Convivencia Social' },
  { value: 'sexualidad', label: 'Sexualidad' },
  { value: 'seguridad_alimentaria', label: 'Seguridad Alimentaria' },
  { value: 'salud_ambiental', label: 'Salud Ambiental' },
  { value: 'salud_bucal', label: 'Salud Bucal' },
]

function calcSemaforo(atenciones: Atencion[]): EstadoSemaforo {
  if (atenciones.length === 0) return 'rojo'
  const allFinished = atenciones.every((a) => a.estado === 'finalizada')
  return allFinished ? 'verde' : 'amarillo'
}

export function AtencionPage() {
  const { visitaId, personaId } = useParams<{ visitaId: string; personaId: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [visita, setVisita] = useState<Visita | null>(null)
  const [persona, setPersona] = useState<PersonaMock | null>(null)
  const [participante, setParticipante] = useState<Participante | null>(null)
  const [atenciones, setAtenciones] = useState<Atencion[]>([])
  const [showForm, setShowForm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<Omit<CreateAtencionInput, 'participanteId' | 'visitaId' | 'personaId'>>({
    tipoAtencion: 'tamizaje',
    dimension: 'vida_saludable',
    resultado: '',
    riesgoIdentificado: false,
    requiereCanalizacion: false,
  })

  const loadData = () => {
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    setVisita(visitas.find((v) => v.id === visitaId) ?? null)

    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    setPersona(personas.find((p) => p.id === personaId) ?? null)

    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
    const part = participantes.find((p) => p.visitaId === visitaId && p.personaId === personaId) ?? null
    setParticipante(part)

    const allAtenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')
    const filtered = allAtenciones.filter((a) => a.visitaId === visitaId && a.personaId === personaId)
    setAtenciones(filtered)
  }

  useEffect(() => { loadData() }, [visitaId, personaId])

  const updateParticipanteSemaforo = (newAtenciones: Atencion[]) => {
    if (!participante) return
    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
    const index = participantes.findIndex((p) => p.id === participante.id)
    if (index === -1) return

    participantes[index] = {
      ...participantes[index],
      semaforo: calcSemaforo(newAtenciones),
      actualizadoEn: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.participantes, JSON.stringify(participantes))
  }

  const handleCreateAtencion = () => {
    if (!form.resultado.trim()) {
      setErrors({ resultado: 'El resultado/observación es obligatorio.' })
      return
    }
    if (!participante) return

    const allAtenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')
    const now = new Date().toISOString()

    const nueva: Atencion = {
      id: `at${Date.now()}`,
      participanteId: participante.id,
      visitaId: visitaId!,
      personaId: personaId!,
      ...form,
      estado: 'abierta',
      creadoPor: usuario.nombre,
      creadoEn: now,
      actualizadoPor: usuario.nombre,
      actualizadoEn: now,
    }

    allAtenciones.push(nueva)
    localStorage.setItem(STORAGE_KEYS.atenciones, JSON.stringify(allAtenciones))

    const updatedForParticipant = allAtenciones.filter((a) => a.visitaId === visitaId && a.personaId === personaId)
    updateParticipanteSemaforo(updatedForParticipant)

    setShowForm(false)
    setForm({ tipoAtencion: 'tamizaje', dimension: 'vida_saludable', resultado: '', riesgoIdentificado: false, requiereCanalizacion: false })
    setErrors({})
    loadData()
  }

  const handleFinalizarAtencion = (atencionId: string) => {
    const allAtenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')
    const index = allAtenciones.findIndex((a) => a.id === atencionId)
    if (index === -1) return

    allAtenciones[index] = {
      ...allAtenciones[index],
      estado: 'finalizada',
      actualizadoPor: usuario.nombre,
      actualizadoEn: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.atenciones, JSON.stringify(allAtenciones))

    const updatedForParticipant = allAtenciones.filter((a) => a.visitaId === visitaId && a.personaId === personaId)
    updateParticipanteSemaforo(updatedForParticipant)
    loadData()
  }

  if (!visita || !persona) {
    return <div className="p-8 text-center text-gray-500">Visita o persona no encontrada.</div>
  }

  const isClosed = visita.estado === 'cerrada'
  const currentSemaforo = calcSemaforo(atenciones)

  return (
    <div>
      <PageHeader
        title={`Atención — ${persona.nombres} ${persona.apellidos}`}
        subtitle={`${persona.tipoDocumento} ${persona.numeroDocumento} • ${persona.edad} años`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: `Visita ${visita.fecha}`, to: `/visitas/${visitaId}` },
          { label: `${persona.nombres} ${persona.apellidos}` },
        ]}
        actions={
          <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(`/visitas/${visitaId}`)}>
            Volver a visita
          </Button>
        }
      />

      {/* Info del participante */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos de la persona" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Nombre completo</dt>
              <dd className="font-medium">{persona.nombres} {persona.apellidos}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Documento</dt>
              <dd className="font-medium">{persona.tipoDocumento} {persona.numeroDocumento}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Edad</dt>
              <dd className="font-medium">{persona.edad} años</dd>
            </div>
            <div>
              <dt className="text-gray-500">Sexo</dt>
              <dd className="font-medium capitalize">{persona.sexo.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-gray-500">EAPB</dt>
              <dd className="font-medium">{persona.eapb || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Teléfono</dt>
              <dd className="font-medium">{persona.telefono || '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Estado de atención">
          <div className="flex flex-col items-center gap-3 py-2">
            <TrafficLight estado={currentSemaforo} />
            <div className="text-center">
              <div className="text-2xl font-bold">{atenciones.length}</div>
              <div className="text-xs text-gray-500">
                {atenciones.filter((a) => a.estado === 'finalizada').length} finalizadas
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de atenciones */}
      <Card
        title={`Atenciones (${atenciones.length})`}
        actions={
          !isClosed ? (
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowForm(true)}>
              Nueva atención
            </Button>
          ) : undefined
        }
        className="mb-6"
      >
        {atenciones.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No hay atenciones registradas.</p>
            {!isClosed && (
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => setShowForm(true)}>
                Crear primera atención
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {atenciones.map((a) => (
              <div key={a.id} className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm capitalize">{a.tipoAtencion.replace('_', ' ')}</span>
                      <StatusBadge status={a.estado} />
                    </div>
                    <p className="text-xs text-gray-500">
                      Dimensión: {dimensionOptions.find((d) => d.value === a.dimension)?.label}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{a.resultado}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      {a.riesgoIdentificado && (
                        <span className="text-red-600 font-medium">⚠ Riesgo identificado</span>
                      )}
                      {a.requiereCanalizacion && (
                        <span className="text-yellow-600 font-medium">→ Requiere canalización</span>
                      )}
                    </div>
                  </div>
                  {a.estado === 'abierta' && !isClosed && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<CheckCircle size={14} />}
                      onClick={() => handleFinalizarAtencion(a.id)}
                    >
                      Finalizar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Formulario nueva atención */}
      {showForm && !isClosed && (
        <Card title="Nueva atención" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tipo de atención" required>
              <Select
                value={form.tipoAtencion}
                onChange={(e) => setForm((p) => ({ ...p, tipoAtencion: e.target.value as TipoAtencion }))}
              >
                {tipoAtencionOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Dimensión" required>
              <Select
                value={form.dimension}
                onChange={(e) => setForm((p) => ({ ...p, dimension: e.target.value as Dimension }))}
              >
                {dimensionOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Resultado / Observación" required error={errors.resultado}>
                <Textarea
                  value={form.resultado}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, resultado: e.target.value }))
                    if (errors.resultado) setErrors((p) => { const n = { ...p }; delete n.resultado; return n })
                  }}
                  placeholder="Describa hallazgos, resultados o notas de la atención..."
                  rows={3}
                />
              </FormField>
            </div>

            <FormField label="¿Riesgo identificado?">
              <Select
                value={form.riesgoIdentificado ? 'si' : 'no'}
                onChange={(e) => setForm((p) => ({ ...p, riesgoIdentificado: e.target.value === 'si' }))}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </Select>
            </FormField>

            <FormField label="¿Requiere canalización?">
              <Select
                value={form.requiereCanalizacion ? 'si' : 'no'}
                onChange={(e) => setForm((p) => ({ ...p, requiereCanalizacion: e.target.value === 'si' }))}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="secondary" onClick={() => { setShowForm(false); setErrors({}) }}>
              Cancelar
            </Button>
            <Button icon={<Save size={16} />} onClick={handleCreateAtencion}>
              Registrar atención
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
