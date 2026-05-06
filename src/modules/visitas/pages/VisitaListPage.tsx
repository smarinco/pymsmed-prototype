import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Visita, EntornoComunitario, Participante } from '@/shared/types/domain'

const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable',
  salud_mental: 'Salud Mental',
  convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad',
  seguridad_alimentaria: 'Seguridad Alimentaria',
  salud_ambiental: 'Salud Ambiental',
  salud_bucal: 'Salud Bucal',
}

interface VisitaConEntorno extends Visita {
  entornoNombre: string
  participantesCount: number
}

export function VisitaListPage() {
  const navigate = useNavigate()
  const [visitas, setVisitas] = useState<VisitaConEntorno[]>([])
  const [filtered, setFiltered] = useState<VisitaConEntorno[]>([])

  useEffect(() => {
    const allVisitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')

    const enriched: VisitaConEntorno[] = allVisitas.map((v) => ({
      ...v,
      entornoNombre: entornos.find((e) => e.id === v.entornoId)?.nombre ?? 'Desconocido',
      participantesCount: participantes.filter((p) => p.visitaId === v.id).length,
    }))

    // Ordenar por fecha descendente
    enriched.sort((a, b) => b.fecha.localeCompare(a.fecha))
    setVisitas(enriched)
    setFiltered(enriched)
  }, [])

  const handleSearch = (query: string) => {
    const q = query.toLowerCase()
    setFiltered(
      visitas.filter(
        (v) =>
          v.entornoNombre.toLowerCase().includes(q) ||
          v.fecha.includes(q) ||
          v.profesionalResponsable.toLowerCase().includes(q) ||
          v.lugar.toLowerCase().includes(q) ||
          (dimensionLabels[v.dimension] || '').toLowerCase().includes(q),
      ),
    )
  }

  const columns: Column<VisitaConEntorno>[] = [
    { key: 'fecha', header: 'Fecha', render: (v) => <span className="font-medium">{v.fecha}</span> },
    {
      key: 'entorno',
      header: 'Entorno',
      render: (v) => (
        <button
          onClick={() => navigate(`/entornos/comunitario/${v.entornoId}`)}
          className="text-[var(--pyms-secondary)] hover:underline text-left"
        >
          {v.entornoNombre}
        </button>
      ),
    },
    { key: 'dimension', header: 'Dimensión', render: (v) => dimensionLabels[v.dimension] || v.dimension },
    { key: 'profesional', header: 'Profesional', render: (v) => v.profesionalResponsable },
    { key: 'lugar', header: 'Lugar', render: (v) => v.lugar },
    { key: 'participantes', header: 'Participantes', render: (v) => v.participantesCount },
    { key: 'estado', header: 'Estado', render: (v) => <StatusBadge status={v.estado} /> },
    {
      key: 'acciones',
      header: '',
      render: (v) => (
        <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/visitas/${v.id}`)}>
          Ver
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Visitas"
        subtitle="Listado general de visitas en todos los entornos"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Visitas' },
        ]}
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No hay visitas registradas."
        searchPlaceholder="Buscar por entorno, fecha, profesional, dimensión..."
        onSearch={handleSearch}
      />
    </div>
  )
}
