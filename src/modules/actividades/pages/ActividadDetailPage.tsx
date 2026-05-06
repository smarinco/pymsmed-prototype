import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ClipboardCheck, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { FormField, Input, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { ActividadColectiva } from '@/shared/types/domain'

const tipoLabels: Record<string, string> = {
  taller: 'Taller', jornada_salud: 'Jornada de Salud', charla: 'Charla',
  capacitacion: 'Capacitación', encuentro_comunitario: 'Encuentro Comunitario', brigada: 'Brigada', otro: 'Otro',
}
const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable', salud_mental: 'Salud Mental', convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad', seguridad_alimentaria: 'Seguridad Alimentaria', salud_ambiental: 'Salud Ambiental', salud_bucal: 'Salud Bucal',
}

export function ActividadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario, tienePermiso } = useAuth()
  const [actividad, setActividad] = useState<ActividadColectiva | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectMotivo, setRejectMotivo] = useState('')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [regForm, setRegForm] = useState({ participantesReales: '', observaciones: '', evidencias: '' })

  const canApprove = tienePermiso('solicitudes.write') // supervisores y admins

  const loadData = useCallback(() => {
    const all: ActividadColectiva[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.actividades) || '[]')
    setActividad(all.find((a) => a.id === id) ?? null)
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  const updateActividad = (updates: Partial<ActividadColectiva>) => {
    const all: ActividadColectiva[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.actividades) || '[]')
    const idx = all.findIndex((a) => a.id === id)
    if (idx === -1) return
    all[idx] = { ...all[idx], ...updates, actualizadoPor: usuario.nombre, actualizadoEn: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEYS.actividades, JSON.stringify(all))
    loadData()
  }

  const handleApprove = () => updateActividad({ estado: 'aprobada', aprobadoPor: usuario.nombre, fechaAprobacion: new Date().toISOString() })

  const handleReject = () => {
    if (!rejectMotivo.trim()) return
    updateActividad({ estado: 'rechazada', motivoRechazo: rejectMotivo })
    setRejectOpen(false)
    setRejectMotivo('')
  }

  const handleRegister = () => {
    if (!regForm.participantesReales) return
    updateActividad({
      estado: 'realizada',
      fechaRealizacion: new Date().toISOString().split('T')[0],
      participantesReales: parseInt(regForm.participantesReales),
      observacionesRealizacion: regForm.observaciones,
      evidencias: regForm.evidencias,
    })
    setRegisterOpen(false)
  }

  if (!actividad) return <div className="p-8 text-center text-gray-500">Actividad no encontrada.</div>

  return (
    <div>
      <PageHeader
        title={actividad.titulo}
        subtitle={`${actividad.codigo} — ${tipoLabels[actividad.tipoActividad]}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Actividades', to: '/actividades' }, { label: actividad.codigo }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/actividades')}>Volver</Button>
            {actividad.estado === 'programada' && canApprove && (
              <>
                <Button size="sm" icon={<CheckCircle size={14} />} onClick={handleApprove}>Aprobar</Button>
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => setRejectOpen(true)}>Rechazar</Button>
              </>
            )}
            {actividad.estado === 'aprobada' && (
              <Button size="sm" icon={<ClipboardCheck size={14} />} onClick={() => setRegisterOpen(true)}>Registrar realización</Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Datos de la actividad" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="text-gray-500">Tipo</dt><dd className="font-medium">{tipoLabels[actividad.tipoActividad]}</dd></div>
            <div><dt className="text-gray-500">Dimensión</dt><dd className="font-medium">{dimensionLabels[actividad.dimension]}</dd></div>
            <div><dt className="text-gray-500">Proyecto</dt><dd className="font-medium">{actividad.proyecto}</dd></div>
            <div><dt className="text-gray-500">Profesional</dt><dd className="font-medium">{actividad.profesionalResponsable}</dd></div>
            <div><dt className="text-gray-500">Fecha programada</dt><dd className="font-medium">{actividad.fechaProgramada}</dd></div>
            <div><dt className="text-gray-500">Horario</dt><dd className="font-medium">{actividad.horario}</dd></div>
            <div><dt className="text-gray-500">Lugar</dt><dd className="font-medium">{actividad.lugar}</dd></div>
            <div><dt className="text-gray-500">Participantes esperados</dt><dd className="font-medium">{actividad.participantesEsperados}</dd></div>
            <div className="col-span-2"><dt className="text-gray-500">Descripción</dt><dd className="font-medium">{actividad.descripcion}</dd></div>
          </dl>
        </Card>

        <Card title="Estado">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Estado</span>
              <StatusBadge status={actividad.estado} />
            </div>
            {actividad.aprobadoPor && (
              <div className="text-sm">
                <span className="text-gray-500">Aprobado por:</span>
                <p className="font-medium">{actividad.aprobadoPor}</p>
                <p className="text-xs text-gray-400">{new Date(actividad.fechaAprobacion!).toLocaleString()}</p>
              </div>
            )}
            {actividad.motivoRechazo && (
              <div className="rounded bg-red-50 border border-red-200 p-3">
                <span className="text-xs text-red-600 font-medium">Motivo de rechazo</span>
                <p className="text-sm text-red-800 mt-1">{actividad.motivoRechazo}</p>
              </div>
            )}
            {actividad.estado === 'realizada' && (
              <div className="border-t pt-3 space-y-2">
                <div className="text-sm"><span className="text-gray-500">Fecha realización:</span> <span className="font-medium">{actividad.fechaRealizacion}</span></div>
                <div className="text-sm"><span className="text-gray-500">Participantes reales:</span> <span className="font-medium">{actividad.participantesReales}</span></div>
                {actividad.observacionesRealizacion && (
                  <div className="text-sm"><span className="text-gray-500">Observaciones:</span><p className="mt-1">{actividad.observacionesRealizacion}</p></div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal rechazo */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Rechazar actividad" size="sm">
        <div className="space-y-4">
          <FormField label="Motivo del rechazo" required>
            <Textarea value={rejectMotivo} onChange={(e) => setRejectMotivo(e.target.value)} placeholder="Describa por qué se rechaza..." rows={3} />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>Cancelar</Button>
            <Button variant="danger" icon={<XCircle size={16} />} onClick={handleReject}>Confirmar rechazo</Button>
          </div>
        </div>
      </Modal>

      {/* Modal registro */}
      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)} title="Registrar actividad realizada" size="md">
        <div className="space-y-4">
          <FormField label="Participantes reales" required>
            <Input type="number" value={regForm.participantesReales} onChange={(e) => setRegForm((p) => ({ ...p, participantesReales: e.target.value }))} placeholder="Ej: 55" />
          </FormField>
          <FormField label="Observaciones de la realización">
            <Textarea value={regForm.observaciones} onChange={(e) => setRegForm((p) => ({ ...p, observaciones: e.target.value }))} placeholder="Hallazgos, notas, seguimientos necesarios..." rows={3} />
          </FormField>
          <FormField label="Evidencias">
            <Input value={regForm.evidencias} onChange={(e) => setRegForm((p) => ({ ...p, evidencias: e.target.value }))} placeholder="Referencias de fotos, listados, etc. (mock)" />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRegisterOpen(false)}>Cancelar</Button>
            <Button icon={<ClipboardCheck size={16} />} onClick={handleRegister}>Registrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
