import { useEffect, useState } from 'react'
import {
  PlusCircle,
  Edit,
  XCircle,
  Lock,
  Unlock,
  FileText,
  CheckCircle,
  Ban,
} from 'lucide-react'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { RegistroAuditoria, TipoAccionAuditoria } from '@/shared/types/domain'

const accionConfig: Record<TipoAccionAuditoria, { icon: React.ReactNode; label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  creacion: { icon: <PlusCircle size={16} />, label: 'Creación', variant: 'success' },
  edicion: { icon: <Edit size={16} />, label: 'Edición', variant: 'info' },
  inactivacion: { icon: <XCircle size={16} />, label: 'Inactivación', variant: 'danger' },
  cierre: { icon: <Lock size={16} />, label: 'Cierre', variant: 'warning' },
  reapertura: { icon: <Unlock size={16} />, label: 'Reapertura', variant: 'info' },
  solicitud: { icon: <FileText size={16} />, label: 'Solicitud', variant: 'default' },
  aprobacion: { icon: <CheckCircle size={16} />, label: 'Aprobación', variant: 'success' },
  rechazo: { icon: <Ban size={16} />, label: 'Rechazo', variant: 'danger' },
}

export function AuditoriaPage() {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([])
  const [filtered, setFiltered] = useState<RegistroAuditoria[]>([])
  const [search, setSearch] = useState('')
  const [moduloFilter, setModuloFilter] = useState('todos')

  useEffect(() => {
    const data: RegistroAuditoria[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.auditoria) || '[]')
    data.sort((a, b) => b.fecha.localeCompare(a.fecha))
    setRegistros(data)
    setFiltered(data)
  }, [])

  useEffect(() => {
    let result = registros
    if (moduloFilter !== 'todos') {
      result = result.filter((r) => r.modulo === moduloFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.descripcion.toLowerCase().includes(q) ||
          r.usuario.toLowerCase().includes(q),
      )
    }
    setFiltered(result)
  }, [registros, moduloFilter, search])

  const modulos = ['todos', ...Array.from(new Set(registros.map((r) => r.modulo)))]

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por descripción o usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm rounded-lg border px-4 py-2 text-sm focus:border-[var(--pyms-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pyms-secondary)]"
        />
        <div className="flex gap-1">
          {modulos.map((m) => (
            <button
              key={m}
              onClick={() => setModuloFilter(m)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors capitalize ${
                moduloFilter === m
                  ? 'bg-[var(--pyms-primary)] text-white'
                  : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No hay registros de auditoría.</div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-4">
            {filtered.map((r) => {
              const config = accionConfig[r.accion]
              return (
                <div key={r.id} className="relative flex gap-4 pl-10">
                  <div className="absolute left-3 top-3 w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-500">
                    {config.icon}
                  </div>
                  <div className="flex-1 rounded-lg border bg-white p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <span className="text-xs text-gray-400">{r.modulo}</span>
                      </div>
                      <time className="text-xs text-gray-400">
                        {new Date(r.fecha).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                      </time>
                    </div>
                    <p className="text-sm text-gray-700">{r.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">Por: {r.usuario}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
