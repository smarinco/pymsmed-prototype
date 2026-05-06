import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { Badge } from '@/shared/components/Badge'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { CaracterizacionAmbiental, NivelRiesgoAmbiental } from '@/shared/types/domain'

const tipoZonaLabels: Record<string, string> = {
  residencial: 'Residencial', comercial: 'Comercial', industrial: 'Industrial', rural: 'Rural', mixta: 'Mixta',
}

const riesgoConfig: Record<NivelRiesgoAmbiental, { label: string; variant: 'default' | 'success' | 'info' | 'warning' | 'danger' }> = {
  sin_riesgo: { label: 'Sin riesgo', variant: 'default' },
  bajo: { label: 'Bajo', variant: 'success' },
  medio: { label: 'Medio', variant: 'warning' },
  alto: { label: 'Alto', variant: 'danger' },
  critico: { label: 'Crítico', variant: 'danger' },
}

export function SaludAmbientalListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<CaracterizacionAmbiental[]>([])
  const [filtered, setFiltered] = useState<CaracterizacionAmbiental[]>([])

  useEffect(() => {
    const items: CaracterizacionAmbiental[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizacionesAmbientales) || '[]')
    items.sort((a, b) => b.fecha.localeCompare(a.fecha))
    setData(items)
    setFiltered(items)
  }, [])

  const handleSearch = (q: string) => {
    const query = q.toLowerCase()
    setFiltered(data.filter((c) =>
      c.codigo.toLowerCase().includes(query) || c.ubicacion.toLowerCase().includes(query) ||
      c.comuna.toLowerCase().includes(query) || c.barrio.toLowerCase().includes(query) ||
      c.profesional.toLowerCase().includes(query)
    ))
  }

  const columns: Column<CaracterizacionAmbiental>[] = [
    { key: 'codigo', header: 'Código', render: (c) => <span className="font-mono text-xs">{c.codigo}</span> },
    {
      key: 'ubicacion', header: 'Ubicación',
      render: (c) => (
        <button onClick={() => navigate(`/salud-ambiental/${c.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {c.ubicacion}
        </button>
      ),
    },
    { key: 'comuna', header: 'Comuna', render: (c) => c.comuna },
    { key: 'tipoZona', header: 'Tipo zona', render: (c) => tipoZonaLabels[c.tipoZona] },
    { key: 'fecha', header: 'Fecha', render: (c) => c.fecha },
    { key: 'profesional', header: 'Profesional', render: (c) => c.profesional },
    {
      key: 'riesgo', header: 'Riesgo',
      render: (c) => {
        const cfg = riesgoConfig[c.riesgoGeneral]
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>
      },
    },
    {
      key: 'estado', header: 'Estado',
      render: (c) => <Badge variant={c.estado === 'completada' ? 'success' : 'warning'}>{c.estado === 'completada' ? 'Completada' : 'En progreso'}</Badge>,
    },
    {
      key: 'acciones', header: '',
      render: (c) => <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/salud-ambiental/${c.id}`)}>Ver</Button>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Salud Ambiental"
        subtitle="Caracterizaciones ambientales y seguimientos"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Salud Ambiental' }]}
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/salud-ambiental/nueva')}>Nueva caracterización</Button>}
      />
      <DataTable columns={columns} data={filtered} emptyMessage="No hay caracterizaciones ambientales."
        searchPlaceholder="Buscar por código, ubicación, comuna o profesional..." onSearch={handleSearch} />
    </div>
  )
}
