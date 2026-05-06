import { useState } from 'react'
import { Send } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { FormField, Input, Textarea, Select } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Solicitud, TipoSolicitud } from '@/shared/types/domain'

interface SolicitudEdicionModalProps {
  open: boolean
  onClose: () => void
  entidadTipo: 'entorno' | 'visita'
  entidadId: string
  entidadNombre: string
}

export function SolicitudEdicionModal({ open, onClose, entidadTipo, entidadId, entidadNombre }: SolicitudEdicionModalProps) {
  const { usuario } = useAuth()
  const [tipo, setTipo] = useState<TipoSolicitud>('edicion')
  const [motivo, setMotivo] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [enviada, setEnviada] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!motivo.trim()) newErrors.motivo = 'El motivo es obligatorio.'
    if (!justificacion.trim()) newErrors.justificacion = 'La justificación es obligatoria.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const solicitudes: Solicitud[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.solicitudes) || '[]')
    const now = new Date().toISOString()

    const nueva: Solicitud = {
      id: `s${Date.now()}`,
      tipo,
      entidadTipo,
      entidadId,
      motivo,
      justificacion,
      solicitante: usuario.nombre,
      estado: 'pendiente',
      creadoPor: usuario.nombre,
      creadoEn: now,
      actualizadoPor: usuario.nombre,
      actualizadoEn: now,
    }

    solicitudes.push(nueva)
    localStorage.setItem(STORAGE_KEYS.solicitudes, JSON.stringify(solicitudes))
    setEnviada(true)
  }

  const handleClose = () => {
    setTipo('edicion')
    setMotivo('')
    setJustificacion('')
    setErrors({})
    setEnviada(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Crear solicitud" size="md">
      {enviada ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Send size={24} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Solicitud enviada</h3>
          <p className="text-sm text-gray-500">
            Su solicitud de {tipo} para <strong>{entidadNombre}</strong> ha sido registrada y queda pendiente de revisión.
          </p>
          <Button variant="secondary" className="mt-4" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Solicitud sobre: <strong>{entidadNombre}</strong> ({entidadTipo})
          </p>

          <FormField label="Tipo de solicitud" required>
            <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoSolicitud)}>
              <option value="edicion">Edición</option>
              <option value="inactivacion">Inactivación</option>
              <option value="reapertura">Reapertura</option>
            </Select>
          </FormField>

          <FormField label="Motivo" required error={errors.motivo}>
            <Input
              value={motivo}
              onChange={(e) => { setMotivo(e.target.value); setErrors((p) => { const n = { ...p }; delete n.motivo; return n }) }}
              placeholder="Resuma brevemente el motivo..."
            />
          </FormField>

          <FormField label="Justificación" required error={errors.justificacion}>
            <Textarea
              value={justificacion}
              onChange={(e) => { setJustificacion(e.target.value); setErrors((p) => { const n = { ...p }; delete n.justificacion; return n }) }}
              placeholder="Explique en detalle por qué necesita esta acción..."
              rows={4}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button icon={<Send size={16} />} onClick={handleSubmit}>Enviar solicitud</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
