import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, UserPlus, UserCheck, ArrowLeft, Plus } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Select } from '@/shared/components/FormField'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Hogar, PersonaMock, IntegranteHogar, ParentescoIntegrante, TipoDocumento, Sexo } from '@/shared/types/domain'

const parentescoOptions: { value: ParentescoIntegrante; label: string }[] = [
  { value: 'jefe_hogar', label: 'Jefe de hogar' }, { value: 'conyuge', label: 'Cónyuge' },
  { value: 'hijo', label: 'Hijo/a' }, { value: 'padre_madre', label: 'Padre/Madre' },
  { value: 'hermano', label: 'Hermano/a' }, { value: 'abuelo', label: 'Abuelo/a' },
  { value: 'nieto', label: 'Nieto/a' }, { value: 'otro_familiar', label: 'Otro familiar' },
  { value: 'no_familiar', label: 'No familiar' },
]

export function AgregarIntegrantePage() {
  const { hogarId } = useParams<{ hogarId: string }>()
  const navigate = useNavigate()
  const [hogar, setHogar] = useState<Hogar | null>(null)
  const [searchDoc, setSearchDoc] = useState('')
  const [results, setResults] = useState<PersonaMock[]>([])
  const [searched, setSearched] = useState(false)
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set())
  const [parentesco, setParentesco] = useState<ParentescoIntegrante>('otro_familiar')
  const [showCreate, setShowCreate] = useState(false)
  const [newP, setNewP] = useState({ tipoDocumento: 'CC' as TipoDocumento, numeroDocumento: '', nombres: '', apellidos: '', sexo: 'masculino' as Sexo, fechaNacimiento: '', telefono: '', eapb: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const hogares: Hogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]')
    setHogar(hogares.find((h) => h.id === hogarId) ?? null)
    const integrantes: IntegranteHogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.integrantes) || '[]')
    setExistingIds(new Set(integrantes.filter((i) => i.hogarId === hogarId).map((i) => i.personaId)))
  }, [hogarId])

  const handleSearch = () => {
    if (!searchDoc.trim()) return
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    setResults(personas.filter((p) => p.numeroDocumento.includes(searchDoc.trim()) || `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchDoc.toLowerCase())))
    setSearched(true)
    setShowCreate(false)
  }

  const addIntegrante = (personaId: string) => {
    const integrantes: IntegranteHogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.integrantes) || '[]')
    const hasJefe = integrantes.some((i) => i.hogarId === hogarId && i.esJefeHogar)
    integrantes.push({
      id: `ih${Date.now()}`, hogarId: hogarId!, personaId,
      parentesco: !hasJefe ? 'jefe_hogar' : parentesco,
      esJefeHogar: !hasJefe,
    })
    localStorage.setItem(STORAGE_KEYS.integrantes, JSON.stringify(integrantes))
    setExistingIds((prev) => new Set(prev).add(personaId))
  }

  const handleCreatePersona = () => {
    const errors: Record<string, string> = {}
    if (!newP.numeroDocumento.trim()) errors.numeroDocumento = 'Obligatorio'
    if (!newP.nombres.trim()) errors.nombres = 'Obligatorio'
    if (!newP.apellidos.trim()) errors.apellidos = 'Obligatorio'
    if (!newP.fechaNacimiento) errors.fechaNacimiento = 'Obligatorio'
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    const birth = new Date(newP.fechaNacimiento)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--

    const persona: PersonaMock = { id: `p${Date.now()}`, ...newP, edad: age }
    personas.push(persona)
    localStorage.setItem(STORAGE_KEYS.personas, JSON.stringify(personas))
    addIntegrante(persona.id)
    navigate(`/hogares/${hogarId}`)
  }

  if (!hogar) return <div className="p-8 text-center text-gray-500">Hogar no encontrado.</div>

  return (
    <div>
      <PageHeader
        title="Agregar Integrante"
        subtitle={`Hogar ${hogar.codigo} — ${hogar.direccion}`}
        breadcrumbs={[{ label: 'Entorno Hogar', to: '/hogares' }, { label: hogar.codigo, to: `/hogares/${hogarId}` }, { label: 'Agregar integrante' }]}
        actions={<Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(`/hogares/${hogarId}`)}>Volver</Button>}
      />

      <Card title="Buscar persona" className="mb-6">
        <div className="flex gap-3 mb-3">
          <div className="flex-1"><Input value={searchDoc} onChange={(e) => setSearchDoc(e.target.value)} placeholder="Documento o nombre..." onKeyDown={(e) => e.key === 'Enter' && handleSearch()} /></div>
          <FormField label=""><Select value={parentesco} onChange={(e) => setParentesco(e.target.value as ParentescoIntegrante)}>{parentescoOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></FormField>
          <Button icon={<Search size={16} />} onClick={handleSearch}>Buscar</Button>
        </div>
        {searched && (
          <div className="mt-3">
            {results.length === 0 ? (
              <div className="rounded-lg bg-gray-50 border p-4 text-center">
                <p className="text-sm text-gray-500 mb-3">No se encontraron personas.</p>
                <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => { setShowCreate(true); setNewP((p) => ({ ...p, numeroDocumento: searchDoc })) }}>Crear nueva persona</Button>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-gray-50">
                    <div>
                      <div className="text-sm font-medium">{p.nombres} {p.apellidos}</div>
                      <div className="text-xs text-gray-500">{p.tipoDocumento} {p.numeroDocumento} • {p.edad} años</div>
                    </div>
                    {existingIds.has(p.id) ? (
                      <span className="flex items-center gap-1 text-xs text-green-600"><UserCheck size={14} /> Ya en el hogar</span>
                    ) : (
                      <Button size="sm" icon={<UserPlus size={14} />} onClick={() => addIntegrante(p.id)}>Agregar</Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>Crear nueva persona</Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {showCreate && (
        <Card title="Registrar nueva persona" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tipo documento"><Select value={newP.tipoDocumento} onChange={(e) => setNewP((p) => ({ ...p, tipoDocumento: e.target.value as TipoDocumento }))}><option value="CC">CC</option><option value="TI">TI</option><option value="RC">RC</option><option value="CE">CE</option><option value="PA">PA</option><option value="PE">PE</option></Select></FormField>
            <FormField label="Número documento" required error={formErrors.numeroDocumento}><Input value={newP.numeroDocumento} onChange={(e) => setNewP((p) => ({ ...p, numeroDocumento: e.target.value }))} /></FormField>
            <FormField label="Nombres" required error={formErrors.nombres}><Input value={newP.nombres} onChange={(e) => setNewP((p) => ({ ...p, nombres: e.target.value }))} /></FormField>
            <FormField label="Apellidos" required error={formErrors.apellidos}><Input value={newP.apellidos} onChange={(e) => setNewP((p) => ({ ...p, apellidos: e.target.value }))} /></FormField>
            <FormField label="Sexo"><Select value={newP.sexo} onChange={(e) => setNewP((p) => ({ ...p, sexo: e.target.value as Sexo }))}><option value="masculino">Masculino</option><option value="femenino">Femenino</option><option value="intersexual">Intersexual</option><option value="no_reporta">No reporta</option></Select></FormField>
            <FormField label="Fecha nacimiento" required error={formErrors.fechaNacimiento}><Input type="date" value={newP.fechaNacimiento} onChange={(e) => setNewP((p) => ({ ...p, fechaNacimiento: e.target.value }))} /></FormField>
            <FormField label="Teléfono"><Input value={newP.telefono} onChange={(e) => setNewP((p) => ({ ...p, telefono: e.target.value }))} /></FormField>
            <FormField label="EAPB"><Input value={newP.eapb} onChange={(e) => setNewP((p) => ({ ...p, eapb: e.target.value }))} /></FormField>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button icon={<UserPlus size={16} />} onClick={handleCreatePersona}>Crear y agregar</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
