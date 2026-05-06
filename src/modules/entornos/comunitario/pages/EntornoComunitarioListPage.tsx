import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EntornoComunitario, Visita } from '@/shared/types/domain'

export function EntornoComunitarioListPage() {
  const navigate = useNavigate()
  const [entornos, setEntornos] = useState<EntornoComunitario[]>([])
  const [filtered, setFiltered] = useState<EntornoComunitario[]>([])
  const [visitas, setVisitas] = useState<Visita[]>([])

  useEffect(() => {
    const data: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const vis: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    setEntornos(data)
    setFiltered(data)
    setVisitas(vis)
  }, [])

  const getVisitCount = (entornoId: string) => visitas.filter(v => v.entornoId === entornoId).length
  const getLastVisit = (entornoId: string) => {
    const ents = visitas.filter(v => v.entornoId === entornoId).sort((a, b) => b.fecha.localeCompare(a.fecha))
    return ents[0]?.fecha ?? '—'
  }

  const handleSearch = (query: string) => {
    const q = query.toLowerCase()
    setFiltered(
      entornos.filter(
        (e) =>
          e.nombre.toLowerCase().includes(q) ||
          e.codigo.toLowerCase().includes(q) ||
          e.comuna.toLowerCase().includes(q) ||
          e.barrio.toLowerCase().includes(q),
      ),
    )
  }

  const columns: Column<EntornoComunitario>[] = [
    { key: 'codigo', header: 'Código', render: (e) => <span className="font-mono text-xs">{e.codigo}</span> },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (e) => (
        <button onClick={() => navigate(`/entornos/comunitario/${e.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {e.nombre}
        </button>
      ),
    },
    { key: 'comuna', header: 'Comuna', render: (e) => e.comuna },
    { key: 'barrio', header: 'Barrio', render: (e) => e.barrio },
    { key: 'referente', header: 'Responsable', render: (e) => e.referenteComunitario },
    { key: 'estado', header: 'Estado', render: (e) => <StatusBadge status={e.estado} /> },
    { key: 'visitas', header: 'Visitas', render: (e) => getVisitCount(e.id) },
    { key: 'ultimaVisita', header: 'Última visita', render: (e) => <span className="text-xs">{getLastVisit(e.id)}</span> },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (e) => (
        <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/entornos/comunitario/${e.id}`)}>
          Ver
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Entornos Comunitarios"
        subtitle="Gestión de puntos y espacios comunitarios para la operación PYMS"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos' },
          { label: 'Comunitario' },
        ]}
        actions={
          <Button icon={<Plus size={16} />} onClick={() => navigate('/entornos/comunitario/nuevo')}>
            Nuevo entorno
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No se encontraron entornos comunitarios."
        searchPlaceholder="Buscar por nombre, código, comuna o barrio..."
        onSearch={handleSearch}
      />
    </div>
  )
}
