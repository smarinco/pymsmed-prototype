import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { FormField, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Solicitud, EstadoSolicitud } from '@/shared/types/domain'

const tipoLabels: Record<string, string> = {
  edicion: 'Edición',
  inactivacion: 'Inactivación',
  reapertura: 'Reapertura',
}

const estadoFilters: { value: string; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobada', label: 'Aprobadas' },
  { value: 'rechazada', label: 'Rechazadas' },
]

export function SolicitudesPage() {
  const { usuario, tienePermiso } = useAuth()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [filtered, setFiltered] = useState<Solicitud[]>([])
  const [estadoFilter, setEstadoFilter] = useState('todas')
  const [search, setSearch] = useState('')

  // Modal detalle
  const [selected, setSelected] = useState<Solicitud | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const canManage = tienePermiso('solicitudes.write')

  const loadData = useCallback(() => {
    const data: Solicitud[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.solicitudes) || '[]')
    // Más recientes primero
    data.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    setSolicitudes(data)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    let result = solicitudes
    if (estadoFilter !== 'todas') {
      result = result.filter((s) => s.estado === estadoFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.motivo.toLowerCase().includes(q) ||
          s.justificacion.toLowerCase().includes(q) ||
          s.solicitante.toLowerCase().includes(q) ||
          tipoLabels[s.tipo]?.toLowerCase().includes(q),
      )
    }
    setFiltered(result)
  }, [solicitudes, estadoFilter, search])

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
    setDetailOpen(false)
    setSelected(null)
  }

  // Stats
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length
  const aprobadas = solicitudes.filter((s) => s.estado === 'aprobada').length
  const rechazadas = solicitudes.filter((s) => s.estado === 'rechazada').length

  return (
    <div>
      <PageHeader
        title="Solicitudes"
        subtitle="Gestión de solicitudes de edición, inactivación y reapertura"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Solicitudes' }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setEstadoFilter('pendiente')}
          className={`rounded-lg border p-4 text-center transition-colors ${estadoFilter === 'pendiente' ? 'bg-yellow-50 border-yellow-300' : 'bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-yellow-600">{pendientes}</div>
          <div className="text-xs text-gray-500">Pendientes</div>
        </button>
        <button
          onClick={() => setEstadoFilter('aprobada')}
          className={`rounded-lg border p-4 text-center transition-colors ${estadoFilter === 'aprobada' ? 'bg-green-50 border-green-300' : 'bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-green-600">{aprobadas}</div>
          <div className="text-xs text-gray-500">Aprobadas</div>
        </button>
        <button
          onClick={() => setEstadoFilter('rechazada')}
          className={`rounded-lg border p-4 text-center transition-colors ${estadoFilter === 'rechazada' ? 'bg-red-50 border-red-300' : 'bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-red-600">{rechazadas}</div>
          <div className="text-xs text-gray-500">Rechazadas</div>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por motivo, solicitante o tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm rounded-lg border px-4 py-2 text-sm focus:border-[var(--pyms-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pyms-secondary)]"
        />
        <div className="flex gap-1">
          {estadoFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setEstadoFilter(f.value)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                estadoFilter === f.value
                  ? 'bg-[var(--pyms-primary)] text-white'
                  : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-400 text-sm">No hay solicitudes con ese criterio.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{tipoLabels[s.tipo]}</Badge>
                    <StatusBadge status={s.estado} />
                    <span className="text-xs text-gray-400">{s.entidadTipo} — {s.entidadId}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{s.motivo}</p>
                  <p className="text-xs text-gray-500">
                    Solicitado por <strong>{s.solicitante}</strong> el {new Date(s.creadoEn).toLocaleDateString()}
                  </p>
                  {s.resueltaPor && (
                    <p className="text-xs text-gray-400">
                      Resuelta por {s.resueltaPor} el {new Date(s.resueltaEn!).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => { setSelected(s); setDetailOpen(true) }}>
                    Ver
                  </Button>
                  {s.estado === 'pendiente' && canManage && (
                    <>
                      <Button variant="secondary" size="sm" icon={<CheckCircle size={14} />} onClick={() => handleResolve(s.id, 'aprobada')}>
                        Aprobar
                      </Button>
                      <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => handleResolve(s.id, 'rechazada')}>
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle */}
      <Modal open={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null) }} title="Detalle de solicitud" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="info">{tipoLabels[selected.tipo]}</Badge>
              <StatusBadge status={selected.estado} />
            </div>

            <div>
              <label className="text-xs text-gray-500">Entidad</label>
              <p className="text-sm font-medium">{selected.entidadTipo} — {selected.entidadId}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Motivo</label>
              <p className="text-sm font-medium">{selected.motivo}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Justificación</label>
              <p className="text-sm">{selected.justificacion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs text-gray-500">Solicitante</label>
                <p className="font-medium">{selected.solicitante}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Fecha solicitud</label>
                <p className="font-medium">{new Date(selected.creadoEn).toLocaleString()}</p>
              </div>
            </div>

            {selected.resueltaPor && (
              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                <div>
                  <label className="text-xs text-gray-500">Resuelta por</label>
                  <p className="font-medium">{selected.resueltaPor}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fecha resolución</label>
                  <p className="font-medium">{new Date(selected.resueltaEn!).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selected.estado === 'pendiente' && canManage && (
              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => handleResolve(selected.id, 'rechazada')}>
                  Rechazar
                </Button>
                <Button size="sm" icon={<CheckCircle size={14} />} onClick={() => handleResolve(selected.id, 'aprobada')}>
                  Aprobar
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
