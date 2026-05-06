import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCheck, XCircle, CalendarClock, CheckCircle, Lock } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { FormField, Input, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Canalizacion, PersonaMock } from '@/shared/types/domain'

const motivoLabels: Record<string, string> = {
  riesgo_nutricional: 'Riesgo Nutricional', riesgo_salud_mental: 'Salud Mental',
  riesgo_violencia: 'Violencia', its_detectada: 'ITS', inseguridad_alimentaria: 'Inseguridad Alimentaria',
  control_prenatal: 'Control Prenatal', riesgo_salud_bucal: 'Salud Bucal', otro: 'Otro',
}
const prioridadConfig: Record<string, { label: string; variant: 'default' | 'info' | 'warning' | 'danger' }> = {
  baja: { label: 'Baja', variant: 'default' }, media: { label: 'Media', variant: 'info' },
  alta: { label: 'Alta', variant: 'warning' }, urgente: { label: 'Urgente', variant: 'danger' },
}
const estadoConfig: Record<string, { label: string; variant: 'default' | 'info' | 'warning' | 'danger' | 'success' }> = {
  generada: { label: 'Generada', variant: 'warning' }, asignada: { label: 'Asignada', variant: 'info' },
  rechazada: { label: 'Rechazada', variant: 'danger' }, reprogramada: { label: 'Reprogramada', variant: 'warning' },
  atendida: { label: 'Atendida', variant: 'success' }, cerrada: { label: 'Cerrada', variant: 'default' },
}

type ModalType = 'asignar' | 'rechazar' | 'reprogramar' | 'atender' | 'cerrar' | null

export function CanalizacionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [can, setCan] = useState<Canalizacion | null>(null)
  const [persona, setPersona] = useState<PersonaMock | null>(null)
  const [modal, setModal] = useState<ModalType>(null)
  const [formData, setFormData] = useState({ asignadoA: '', fechaCita: '', motivo: '', observaciones: '' })

  const loadData = useCallback(() => {
    const all: Canalizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.canalizaciones) || '[]')
    const found = all.find((c) => c.id === id) ?? null
    setCan(found)
    if (found) {
      const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
      setPersona(personas.find((p) => p.id === found.personaId) ?? null)
    }
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  const update = (changes: Partial<Canalizacion>) => {
    const all: Canalizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.canalizaciones) || '[]')
    const idx = all.findIndex((c) => c.id === id)
    if (idx === -1) return
    all[idx] = { ...all[idx], ...changes, actualizadoPor: usuario.nombre, actualizadoEn: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEYS.canalizaciones, JSON.stringify(all))
    setModal(null)
    setFormData({ asignadoA: '', fechaCita: '', motivo: '', observaciones: '' })
    loadData()
  }

  if (!can) return <div className="p-8 text-center text-gray-500">Canalización no encontrada.</div>

  const eCfg = estadoConfig[can.estado]
  const pCfg = prioridadConfig[can.prioridad]
  const isClosed = can.estado === 'cerrada'
  const canManage = usuario.rol === 'eapb' || usuario.rol === 'administrador' || usuario.rol === 'supervisor'

  return (
    <div>
      <PageHeader
        title={`Canalización ${can.codigo}`}
        subtitle={motivoLabels[can.motivo]}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Canalizaciones', to: '/canalizaciones' }, { label: can.codigo }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/canalizaciones')}>Volver</Button>
            {can.estado === 'generada' && canManage && (
              <>
                <Button size="sm" icon={<UserCheck size={14} />} onClick={() => setModal('asignar')}>Asignar cita</Button>
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => setModal('rechazar')}>Rechazar</Button>
              </>
            )}
            {(can.estado === 'asignada' || can.estado === 'reprogramada') && canManage && (
              <>
                <Button size="sm" icon={<CheckCircle size={14} />} onClick={() => setModal('atender')}>Marcar atendida</Button>
                <Button variant="secondary" size="sm" icon={<CalendarClock size={14} />} onClick={() => setModal('reprogramar')}>Reprogramar</Button>
              </>
            )}
            {can.estado === 'atendida' && canManage && (
              <Button variant="secondary" size="sm" icon={<Lock size={14} />} onClick={() => setModal('cerrar')}>Cerrar seguimiento</Button>
            )}
          </div>
        }
      />

      {isClosed && (
        <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 flex items-center gap-3">
          <Lock size={18} className="text-gray-500" />
          <p className="text-sm text-gray-600">Canalización cerrada el {can.fechaCierre}.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Datos paciente */}
        <Card title="Paciente">
          {persona ? (
            <dl className="space-y-2 text-sm">
              <div><dt className="text-gray-500">Nombre</dt><dd className="font-medium">{persona.nombres} {persona.apellidos}</dd></div>
              <div><dt className="text-gray-500">Documento</dt><dd className="font-medium">{persona.tipoDocumento} {persona.numeroDocumento}</dd></div>
              <div><dt className="text-gray-500">Edad</dt><dd className="font-medium">{persona.edad} años</dd></div>
              <div><dt className="text-gray-500">EAPB</dt><dd className="font-medium">{persona.eapb}</dd></div>
              <div><dt className="text-gray-500">Teléfono</dt><dd className="font-medium">{persona.telefono || '—'}</dd></div>
            </dl>
          ) : <p className="text-sm text-gray-400">Persona no encontrada</p>}
        </Card>

        {/* Datos canalización */}
        <Card title="Datos de la canalización">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><dt className="text-gray-500">Estado</dt><dd><Badge variant={eCfg.variant}>{eCfg.label}</Badge></dd></div>
            <div className="flex items-center justify-between"><dt className="text-gray-500">Prioridad</dt><dd><Badge variant={pCfg.variant}>{pCfg.label}</Badge></dd></div>
            <div><dt className="text-gray-500">Motivo</dt><dd className="font-medium">{motivoLabels[can.motivo]}</dd></div>
            <div><dt className="text-gray-500">EAPB destino</dt><dd className="font-medium">{can.eapbDestino}</dd></div>
            <div><dt className="text-gray-500">Profesional origen</dt><dd className="font-medium">{can.profesionalOrigen}</dd></div>
          </dl>
        </Card>

        {/* Gestión */}
        <Card title="Gestión EAPB">
          <dl className="space-y-2 text-sm">
            {can.asignadoA && <div><dt className="text-gray-500">Asignado a</dt><dd className="font-medium">{can.asignadoA}</dd></div>}
            {can.fechaCita && <div><dt className="text-gray-500">Fecha cita</dt><dd className="font-medium">{can.fechaCita}</dd></div>}
            {can.fechaReprogramacion && <div><dt className="text-gray-500">Reprogramada para</dt><dd className="font-medium">{can.fechaReprogramacion}</dd></div>}
            {can.motivoRechazo && (
              <div className="rounded bg-red-50 border border-red-200 p-2 mt-2">
                <dt className="text-xs text-red-600 font-medium">Motivo rechazo</dt>
                <dd className="text-sm text-red-800">{can.motivoRechazo}</dd>
              </div>
            )}
            {can.observacionesSeguimiento && <div><dt className="text-gray-500">Seguimiento</dt><dd>{can.observacionesSeguimiento}</dd></div>}
            {!can.asignadoA && !can.motivoRechazo && <p className="text-gray-400">Sin gestión registrada.</p>}
          </dl>
        </Card>
      </div>

      <Card title="Descripción de la canalización">
        <p className="text-sm text-gray-700">{can.descripcion}</p>
      </Card>

      {/* Modal asignar */}
      <Modal open={modal === 'asignar'} onClose={() => setModal(null)} title="Asignar cita" size="sm">
        <div className="space-y-4">
          <FormField label="Profesional asignado" required><Input value={formData.asignadoA} onChange={(e) => setFormData((p) => ({ ...p, asignadoA: e.target.value }))} placeholder="Nombre del profesional" /></FormField>
          <FormField label="Fecha de cita" required><Input type="date" value={formData.fechaCita} onChange={(e) => setFormData((p) => ({ ...p, fechaCita: e.target.value }))} /></FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button icon={<UserCheck size={16} />} onClick={() => {
              if (!formData.asignadoA || !formData.fechaCita) return
              update({ estado: 'asignada', asignadoA: formData.asignadoA, fechaCita: formData.fechaCita })
            }}>Asignar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal rechazar */}
      <Modal open={modal === 'rechazar'} onClose={() => setModal(null)} title="Rechazar canalización" size="sm">
        <div className="space-y-4">
          <FormField label="Motivo del rechazo" required><Textarea value={formData.motivo} onChange={(e) => setFormData((p) => ({ ...p, motivo: e.target.value }))} rows={3} /></FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button variant="danger" icon={<XCircle size={16} />} onClick={() => {
              if (!formData.motivo) return
              update({ estado: 'rechazada', motivoRechazo: formData.motivo })
            }}>Rechazar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal reprogramar */}
      <Modal open={modal === 'reprogramar'} onClose={() => setModal(null)} title="Reprogramar cita" size="sm">
        <div className="space-y-4">
          <FormField label="Nueva fecha" required><Input type="date" value={formData.fechaCita} onChange={(e) => setFormData((p) => ({ ...p, fechaCita: e.target.value }))} /></FormField>
          <FormField label="Observaciones"><Textarea value={formData.observaciones} onChange={(e) => setFormData((p) => ({ ...p, observaciones: e.target.value }))} rows={2} /></FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button icon={<CalendarClock size={16} />} onClick={() => {
              if (!formData.fechaCita) return
              update({ estado: 'reprogramada', fechaReprogramacion: formData.fechaCita, observacionesSeguimiento: formData.observaciones || can.observacionesSeguimiento })
            }}>Reprogramar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal atender */}
      <Modal open={modal === 'atender'} onClose={() => setModal(null)} title="Registrar atención" size="sm">
        <div className="space-y-4">
          <FormField label="Observaciones de seguimiento" required><Textarea value={formData.observaciones} onChange={(e) => setFormData((p) => ({ ...p, observaciones: e.target.value }))} placeholder="Resultado de la atención..." rows={3} /></FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button icon={<CheckCircle size={16} />} onClick={() => {
              if (!formData.observaciones) return
              update({ estado: 'atendida', observacionesSeguimiento: formData.observaciones })
            }}>Registrar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal cerrar */}
      <Modal open={modal === 'cerrar'} onClose={() => setModal(null)} title="Cerrar seguimiento" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">¿Confirma que el seguimiento de esta canalización está completo?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button icon={<Lock size={16} />} onClick={() => update({ estado: 'cerrada', fechaCierre: new Date().toISOString().split('T')[0] })}>Cerrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
