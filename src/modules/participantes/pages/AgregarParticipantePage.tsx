import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, UserPlus, UserCheck, ArrowLeft, Plus } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  Visita,
  EntornoComunitario,
  PersonaMock,
  Participante,
  TipoDocumento,
  Sexo,
} from '@/shared/types/domain'

const tipoDocOptions: { value: TipoDocumento; label: string }[] = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'RC', label: 'Registro Civil' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'PE', label: 'Permiso Especial' },
]

const sexoOptions: { value: Sexo; label: string }[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'intersexual', label: 'Intersexual' },
  { value: 'no_reporta', label: 'No reporta' },
]

export function AgregarParticipantePage() {
  const { visitaId } = useParams<{ visitaId: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [visita, setVisita] = useState<Visita | null>(null)
  const [entorno, setEntorno] = useState<EntornoComunitario | null>(null)

  // Búsqueda
  const [searchDoc, setSearchDoc] = useState('')
  const [searchResults, setSearchResults] = useState<PersonaMock[]>([])
  const [searched, setSearched] = useState(false)

  // Formulario nueva persona
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPersona, setNewPersona] = useState({
    tipoDocumento: 'CC' as TipoDocumento,
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    sexo: 'masculino' as Sexo,
    fechaNacimiento: '',
    telefono: '',
    eapb: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Participantes ya en la visita
  const [participantesIds, setParticipantesIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const found = visitas.find((v) => v.id === visitaId) ?? null
    setVisita(found)

    if (found) {
      const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
      setEntorno(entornos.find((e) => e.id === found.entornoId) ?? null)

      const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
      const ids = new Set(participantes.filter((p) => p.visitaId === visitaId).map((p) => p.personaId))
      setParticipantesIds(ids)
    }
  }, [visitaId])

  const handleSearch = () => {
    if (!searchDoc.trim()) return
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    const results = personas.filter(
      (p) =>
        p.numeroDocumento.includes(searchDoc.trim()) ||
        `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchDoc.toLowerCase()),
    )
    setSearchResults(results)
    setSearched(true)
    setShowCreateForm(false)
  }

  const addParticipante = (personaId: string) => {
    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
    const now = new Date().toISOString()

    const nuevo: Participante = {
      id: `pa${Date.now()}`,
      visitaId: visitaId!,
      personaId,
      semaforo: 'rojo',
      creadoPor: usuario.nombre,
      creadoEn: now,
      actualizadoPor: usuario.nombre,
      actualizadoEn: now,
    }

    participantes.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.participantes, JSON.stringify(participantes))
    setParticipantesIds((prev) => new Set(prev).add(personaId))
  }

  const calcEdad = (fechaNacimiento: string): number => {
    const birth = new Date(fechaNacimiento)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const handleCreatePersona = () => {
    const errors: Record<string, string> = {}
    if (!newPersona.numeroDocumento.trim()) errors.numeroDocumento = 'Obligatorio'
    if (!newPersona.nombres.trim()) errors.nombres = 'Obligatorio'
    if (!newPersona.apellidos.trim()) errors.apellidos = 'Obligatorio'
    if (!newPersona.fechaNacimiento) errors.fechaNacimiento = 'Obligatorio'
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    const edad = calcEdad(newPersona.fechaNacimiento)

    const persona: PersonaMock = {
      id: `p${Date.now()}`,
      ...newPersona,
      edad,
    }

    personas.push(persona)
    localStorage.setItem(STORAGE_KEYS.personas, JSON.stringify(personas))

    // Agregar automáticamente como participante
    addParticipante(persona.id)
    navigate(`/visitas/${visitaId}`)
  }

  const handleChangePersona = (field: string, value: string) => {
    setNewPersona((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  if (!visita) {
    return <div className="p-8 text-center text-gray-500">Visita no encontrada.</div>
  }

  return (
    <div>
      <PageHeader
        title="Agregar Participante"
        subtitle={`Visita ${visita.fecha} — ${visita.lugar}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          ...(entorno
            ? [
                { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
                { label: entorno.nombre, to: `/entornos/comunitario/${entorno.id}` },
              ]
            : []),
          { label: `Visita ${visita.fecha}`, to: `/visitas/${visitaId}` },
          { label: 'Agregar participante' },
        ]}
        actions={
          <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(`/visitas/${visitaId}`)}>
            Volver a visita
          </Button>
        }
      />

      {/* Búsqueda */}
      <Card title="Buscar persona por documento o nombre" className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              placeholder="Número de documento o nombre..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button icon={<Search size={16} />} onClick={handleSearch}>
            Buscar
          </Button>
        </div>

        {/* Resultados */}
        {searched && (
          <div className="mt-4">
            {searchResults.length === 0 ? (
              <div className="rounded-lg bg-gray-50 border p-4 text-center">
                <p className="text-sm text-gray-500 mb-3">No se encontraron personas con ese criterio.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => {
                    setShowCreateForm(true)
                    setNewPersona((prev) => ({ ...prev, numeroDocumento: searchDoc }))
                  }}
                >
                  Crear nueva persona
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mt-3">
                {searchResults.map((p) => {
                  const yaAgregado = participantesIds.has(p.id)
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-gray-50"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {p.nombres} {p.apellidos}
                        </div>
                        <div className="text-xs text-gray-500">
                          {p.tipoDocumento} {p.numeroDocumento} • {p.edad} años • {p.eapb}
                        </div>
                      </div>
                      {yaAgregado ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <UserCheck size={14} /> Ya en la visita
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          icon={<UserPlus size={14} />}
                          onClick={() => addParticipante(p.id)}
                        >
                          Agregar
                        </Button>
                      )}
                    </div>
                  )
                })}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Plus size={14} />}
                    onClick={() => setShowCreateForm(true)}
                  >
                    Crear nueva persona
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Formulario crear persona */}
      {showCreateForm && (
        <Card title="Registrar nueva persona (mock)" className="mb-6">
          <p className="text-xs text-gray-500 mb-4">
            TODO-SIISMED: En producción, esta búsqueda consultará el servicio Personas Salud.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tipo documento" required>
              <Select
                value={newPersona.tipoDocumento}
                onChange={(e) => handleChangePersona('tipoDocumento', e.target.value)}
              >
                {tipoDocOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Número documento" required error={formErrors.numeroDocumento}>
              <Input
                value={newPersona.numeroDocumento}
                onChange={(e) => handleChangePersona('numeroDocumento', e.target.value)}
              />
            </FormField>

            <FormField label="Nombres" required error={formErrors.nombres}>
              <Input
                value={newPersona.nombres}
                onChange={(e) => handleChangePersona('nombres', e.target.value)}
              />
            </FormField>

            <FormField label="Apellidos" required error={formErrors.apellidos}>
              <Input
                value={newPersona.apellidos}
                onChange={(e) => handleChangePersona('apellidos', e.target.value)}
              />
            </FormField>

            <FormField label="Sexo" required>
              <Select
                value={newPersona.sexo}
                onChange={(e) => handleChangePersona('sexo', e.target.value)}
              >
                {sexoOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Fecha de nacimiento" required error={formErrors.fechaNacimiento}>
              <Input
                type="date"
                value={newPersona.fechaNacimiento}
                onChange={(e) => handleChangePersona('fechaNacimiento', e.target.value)}
              />
            </FormField>

            <FormField label="Teléfono">
              <Input
                value={newPersona.telefono}
                onChange={(e) => handleChangePersona('telefono', e.target.value)}
              />
            </FormField>

            <FormField label="EAPB">
              <Input
                value={newPersona.eapb}
                onChange={(e) => handleChangePersona('eapb', e.target.value)}
                placeholder="Ej: Sura EPS"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              Cancelar
            </Button>
            <Button icon={<UserPlus size={16} />} onClick={handleCreatePersona}>
              Crear y agregar a visita
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
