import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Calendar } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { ActividadColectiva } from '@/shared/types/domain'

const tipoLabels: Record<string, string> = {
  taller: 'Taller', jornada_salud: 'Jornada de Salud', charla: 'Charla',
  capacitacion: 'Capacitación', encuentro_comunitario: 'Encuentro', brigada: 'Brigada', otro: 'Otro',
}
const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable', salud_mental: 'Salud Mental', convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad', seguridad_alimentaria: 'Seg. Alimentaria', salud_ambiental: 'Salud Ambiental', salud_bucal: 'Salud Bucal',
}
const estadoFilters = ['todas', 'programada', 'aprobada', 'realizada', 'rechazada', 'cancelada']

export function ActividadesListPage() {
  const navigate = useNavigate()
  const [actividades, setActividades] = useState<ActividadColectiva[]>([])
  const [filtered, setFiltered] = useState<ActividadColectiva[]>([])
  const [estadoFilter, setEstadoFilter] = useState('todas')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const data: ActividadColectiva[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.actividades) || '[]')
    data.sort((a, b) => b.fechaProgramada.localeCompare(a.fechaProgramada))
    setActividades(data)
  }, [])

  useEffect(() => {
    let result = actividades
    if (estadoFilter !== 'todas') result = result.filter((a) => a.estado === estadoFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((a) =>
        a.titulo.toLowerCase().includes(q) || a.profesionalResponsable.toLowerCase().includes(q) ||
        a.lugar.toLowerCase().includes(q) || a.codigo.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [actividades, estadoFilter, search])

  const counts = {
    programada: actividades.filter((a) => a.estado === 'programada').length,
    aprobada: actividades.filter((a) => a.estado === 'aprobada').length,
    realizada: actividades.filter((a) => a.estado === 'realizada').length,
    rechazada: actividades.filter((a) => a.estado === 'rechazada').length,
  }

  return (
    <div>
      <PageHeader
        title="Actividades Colectivas"
        subtitle="Cronograma, aprobación y registro de actividades grupales"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Actividades Colectivas' }]}
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/actividades/nueva')}>Programar actividad</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {([
          { key: 'programada', label: 'Programadas', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { key: 'aprobada', label: 'Aprobadas', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { key: 'realizada', label: 'Realizadas', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
          { key: 'rechazada', label: 'Rechazadas', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
        ] as const).map((s) => (
          <button key={s.key} onClick={() => setEstadoFilter(estadoFilter === s.key ? 'todas' : s.key)}
            className={`rounded-lg border p-3 text-center transition-colors ${estadoFilter === s.key ? s.bg : 'bg-white hover:bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{counts[s.key]}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-4">
        <input type="text" placeholder="Buscar por título, profesional, lugar..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm rounded-lg border px-4 py-2 text-sm focus:border-[var(--pyms-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pyms-secondary)]" />
        <div className="flex gap-1">
          {estadoFilters.map((f) => (
            <button key={f} onClick={() => setEstadoFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors capitalize ${
                estadoFilter === f ? 'bg-[var(--pyms-primary)] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Listado */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-400 text-sm">No hay actividades con ese criterio.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-400">{a.codigo}</span>
                    <StatusBadge status={a.estado} />
                    <Badge variant="info">{tipoLabels[a.tipoActividad]}</Badge>
                    <Badge variant="default">{dimensionLabels[a.dimension]}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{a.titulo}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={12} />{a.fechaProgramada} • {a.horario}</span>
                    <span>{a.lugar}</span>
                    <span>{a.profesionalResponsable}</span>
                    <span>{a.participantesReales ?? a.participantesEsperados} participantes{a.participantesReales ? '' : ' (est.)'}</span>
                  </div>
                  {a.motivoRechazo && <p className="text-xs text-red-600 mt-1">Rechazo: {a.motivoRechazo}</p>}
                </div>
                <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/actividades/${a.id}`)}>Ver</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
