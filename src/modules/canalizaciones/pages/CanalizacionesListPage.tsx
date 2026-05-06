import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Canalizacion, PersonaMock } from '@/shared/types/domain'

const motivoLabels: Record<string, string> = {
  riesgo_nutricional: 'Riesgo Nutricional', riesgo_salud_mental: 'Salud Mental',
  riesgo_violencia: 'Violencia', its_detectada: 'ITS', inseguridad_alimentaria: 'Seg. Alimentaria',
  control_prenatal: 'Control Prenatal', riesgo_salud_bucal: 'Salud Bucal', otro: 'Otro',
}

const prioridadConfig: Record<string, { label: string; variant: 'default' | 'info' | 'warning' | 'danger' }> = {
  baja: { label: 'Baja', variant: 'default' },
  media: { label: 'Media', variant: 'info' },
  alta: { label: 'Alta', variant: 'warning' },
  urgente: { label: 'Urgente', variant: 'danger' },
}

const estadoCanalizacionConfig: Record<string, { label: string; variant: 'default' | 'info' | 'warning' | 'danger' | 'success' }> = {
  generada: { label: 'Generada', variant: 'warning' },
  asignada: { label: 'Asignada', variant: 'info' },
  rechazada: { label: 'Rechazada', variant: 'danger' },
  reprogramada: { label: 'Reprogramada', variant: 'warning' },
  atendida: { label: 'Atendida', variant: 'success' },
  cerrada: { label: 'Cerrada', variant: 'default' },
}

const estadoFilters = ['todas', 'generada', 'asignada', 'reprogramada', 'atendida', 'rechazada', 'cerrada']

interface CanalizacionEnriquecida extends Canalizacion {
  personaNombre: string
  personaDocumento: string
}

export function CanalizacionesListPage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const isEapb = usuario.rol === 'eapb'

  const [canalizaciones, setCanalizaciones] = useState<CanalizacionEnriquecida[]>([])
  const [filtered, setFiltered] = useState<CanalizacionEnriquecida[]>([])
  const [estadoFilter, setEstadoFilter] = useState('todas')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const all: Canalizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.canalizaciones) || '[]')
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')

    const enriched: CanalizacionEnriquecida[] = all.map((c) => {
      const persona = personas.find((p) => p.id === c.personaId)
      return {
        ...c,
        personaNombre: persona ? `${persona.nombres} ${persona.apellidos}` : 'Desconocido',
        personaDocumento: persona ? `${persona.tipoDocumento} ${persona.numeroDocumento}` : '',
      }
    })
    enriched.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    setCanalizaciones(enriched)
  }, [])

  useEffect(() => {
    let result = canalizaciones
    if (estadoFilter !== 'todas') result = result.filter((c) => c.estado === estadoFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((c) =>
        c.personaNombre.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q) || c.eapbDestino.toLowerCase().includes(q) ||
        c.profesionalOrigen.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [canalizaciones, estadoFilter, search])

  const counts = {
    generada: canalizaciones.filter((c) => c.estado === 'generada').length,
    asignada: canalizaciones.filter((c) => c.estado === 'asignada').length,
    atendida: canalizaciones.filter((c) => c.estado === 'atendida').length,
    pendientes: canalizaciones.filter((c) => ['generada', 'asignada', 'reprogramada'].includes(c.estado)).length,
  }

  return (
    <div>
      <PageHeader
        title={isEapb ? 'Bandeja EAPB — Canalizaciones' : 'Canalizaciones'}
        subtitle={isEapb
          ? `Canalizaciones asignadas a ${usuario.contrato.proyecto}`
          : 'Seguimiento de atenciones canalizadas a EAPB'
        }
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Canalizaciones' }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border bg-white p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{counts.generada}</div>
          <div className="text-xs text-gray-500">Por asignar</div>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{counts.asignada}</div>
          <div className="text-xs text-gray-500">Asignadas</div>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{counts.atendida}</div>
          <div className="text-xs text-gray-500">Atendidas</div>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center">
          <div className="text-2xl font-bold text-gray-800">{counts.pendientes}</div>
          <div className="text-xs text-gray-500">Pendientes total</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="Buscar por persona, código, EAPB, profesional..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-sm rounded-lg border px-4 py-2 text-sm focus:border-[var(--pyms-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pyms-secondary)]" />
        <div className="flex gap-1 flex-wrap">
          {estadoFilters.map((f) => (
            <button key={f} onClick={() => setEstadoFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors capitalize ${
                estadoFilter === f ? 'bg-[var(--pyms-primary)] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-400 text-sm">No hay canalizaciones con ese criterio.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const estadoCfg = estadoCanalizacionConfig[c.estado]
            const prioCfg = prioridadConfig[c.prioridad]
            return (
              <div key={c.id} className="rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400">{c.codigo}</span>
                      <Badge variant={estadoCfg.variant}>{estadoCfg.label}</Badge>
                      <Badge variant={prioCfg.variant}>{prioCfg.label}</Badge>
                      <Badge variant="default">{motivoLabels[c.motivo]}</Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{c.personaNombre}</span>
                      <span className="text-gray-400 ml-2 text-xs">{c.personaDocumento}</span>
                    </div>
                    <p className="text-xs text-gray-600">{c.descripcion}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Origen: {c.profesionalOrigen}</span>
                      <span><ArrowRight size={10} className="inline" /> {c.eapbDestino}</span>
                      {c.fechaCita && <span>Cita: {c.fechaCita}</span>}
                      {c.asignadoA && <span>Asignado: {c.asignadoA}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/canalizaciones/${c.id}`)}>Ver</Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
