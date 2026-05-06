import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Solicitud, EstadoSolicitud } from '@/shared/types/domain'

const tipoLabels: Record<string, string> = {
  edicion: 'Edición',
  inactivacion: 'Inactivación',
  reapertura: 'Reapertura',
}

export function AdminSolicitudesPage() {
  const { usuario, tienePermiso } = useAuth()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [selected, setSelected] = useState<Solicitud | null>(null)
  const canManage = tienePermiso('solicitudes.write')

  const loadData = useCallback(() => {
    const data: Solicitud[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.solicitudes) || '[]')
    data.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    setSolicitudes(data)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleResolve = (id: string, nuevoEstado: EstadoSolicitud) => {
    const all: Solicitud[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.solicitudes) || '[]')
    const index = all.findIndex((s) => s.id === id)
    if (index === -1) return
    all[index] = {
      ...all[index],
      estado: nuevoEstado,
      resueltaPor: usuario.nombre,
      resueltaEn: new Date().toISOString(),
      actualizadoPor: usuario.nombre,
      actualizadoEn: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.solicitudes, JSON.stringify(all))
    loadData()
    setSelected(null)
  }

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')

  return (
    <div>
      {pendientes.length > 0 && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 mb-4 text-sm text-yellow-800">
          Hay <strong>{pendientes.length}</strong> solicitud(es) pendiente(s) de revisión.
        </div>
      )}

      {solicitudes.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-400 text-sm">No hay solicitudes.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => (
            <div key={s.id} className="rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{tipoLabels[s.tipo]}</Badge>
                    <StatusBadge status={s.estado} />
                  </div>
                  <p className="text-sm font-medium">{s.motivo}</p>
                  <p className="text-xs text-gray-500">
                    {s.solicitante} • {new Date(s.creadoEn).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setSelected(s)}>Ver</Button>
                  {s.estado === 'pendiente' && canManage && (
                    <>
                      <Button variant="secondary" size="sm" icon={<CheckCircle size={14} />} onClick={() => handleResolve(s.id, 'aprobada')}>Aprobar</Button>
                      <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => handleResolve(s.id, 'rechazada')}>Rechazar</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detalle de solicitud" size="md">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex gap-2"><Badge variant="info">{tipoLabels[selected.tipo]}</Badge><StatusBadge status={selected.estado} /></div>
            <div><span className="text-gray-500">Entidad:</span> {selected.entidadTipo} — {selected.entidadId}</div>
            <div><span className="text-gray-500">Motivo:</span> {selected.motivo}</div>
            <div><span className="text-gray-500">Justificación:</span> {selected.justificacion}</div>
            <div><span className="text-gray-500">Solicitante:</span> {selected.solicitante}</div>
            {selected.resueltaPor && (
              <div className="border-t pt-2"><span className="text-gray-500">Resuelta por:</span> {selected.resueltaPor} el {new Date(selected.resueltaEn!).toLocaleString()}</div>
            )}
            {selected.estado === 'pendiente' && canManage && (
              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => handleResolve(selected.id, 'rechazada')}>Rechazar</Button>
                <Button size="sm" icon={<CheckCircle size={14} />} onClick={() => handleResolve(selected.id, 'aprobada')}>Aprobar</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
