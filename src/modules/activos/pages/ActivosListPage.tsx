import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { Badge } from '@/shared/components/Badge'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { ActivoTerritorial, CategoriaActivo } from '@/shared/types/domain'

const categoriaConfig: Record<CategoriaActivo, { label: string; variant: 'default' | 'success' | 'info' | 'warning' | 'danger' }> = {
  salud: { label: 'Salud', variant: 'danger' },
  educacion: { label: 'Educación', variant: 'info' },
  recreacion: { label: 'Recreación', variant: 'success' },
  comunitario: { label: 'Comunitario', variant: 'warning' },
  institucional: { label: 'Institucional', variant: 'default' },
  cultural: { label: 'Cultural', variant: 'info' },
  ambiental: { label: 'Ambiental', variant: 'success' },
  economico: { label: 'Económico', variant: 'warning' },
}

const estadoActivoConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  activo: { label: 'Activo', variant: 'success' },
  inactivo: { label: 'Inactivo', variant: 'danger' },
  en_verificacion: { label: 'En verificación', variant: 'warning' },
}

export function ActivosListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<ActivoTerritorial[]>([])
  const [filtered, setFiltered] = useState<ActivoTerritorial[]>([])
  const [catFilter, setCatFilter] = useState('todas')

  useEffect(() => {
    const items: ActivoTerritorial[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.activos) || '[]')
    setData(items)
    setFiltered(items)
  }, [])

  useEffect(() => {
    let result = data
    if (catFilter !== 'todas') result = result.filter((a) => a.categoria === catFilter)
    setFiltered(result)
  }, [data, catFilter])

  const handleSearch = (q: string) => {
    const query = q.toLowerCase()
    let result = data
    if (catFilter !== 'todas') result = result.filter((a) => a.categoria === catFilter)
    setFiltered(result.filter((a) =>
      a.nombre.toLowerCase().includes(query) || a.codigo.toLowerCase().includes(query) ||
      a.comuna.toLowerCase().includes(query) || a.barrio.toLowerCase().includes(query) ||
      a.descripcion.toLowerCase().includes(query)
    ))
  }

  const categorias = ['todas', ...Object.keys(categoriaConfig)]

  const columns: Column<ActivoTerritorial>[] = [
    { key: 'codigo', header: 'Código', render: (a) => <span className="font-mono text-xs">{a.codigo}</span> },
    {
      key: 'nombre', header: 'Nombre',
      render: (a) => (
        <button onClick={() => navigate(`/mapeo-activos/${a.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {a.nombre}
        </button>
      ),
    },
    { key: 'categoria', header: 'Categoría', render: (a) => { const c = categoriaConfig[a.categoria]; return <Badge variant={c.variant}>{c.label}</Badge> } },
    { key: 'comuna', header: 'Comuna', render: (a) => a.comuna },
    { key: 'barrio', header: 'Barrio', render: (a) => a.barrio },
    { key: 'jornadas', header: 'Jornadas', render: (a) => a.jornadasAsociadas.length || '—' },
    { key: 'estado', header: 'Estado', render: (a) => { const e = estadoActivoConfig[a.estado]; return <Badge variant={e.variant}>{e.label}</Badge> } },
    { key: 'acciones', header: '', render: (a) => <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/mapeo-activos/${a.id}`)}>Ver</Button> },
  ]

  return (
    <div>
      <PageHeader
        title="Mapeo de Activos"
        subtitle="Activos territoriales y comunitarios"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Mapeo de Activos' }]}
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/mapeo-activos/nuevo')}>Nuevo activo</Button>}
      />

      {/* Filtro por categoría */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {categorias.map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors capitalize ${
              catFilter === c ? 'bg-[var(--pyms-primary)] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>{c}</button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No hay activos territoriales."
        searchPlaceholder="Buscar por nombre, código, comuna o descripción..." onSearch={handleSearch} />
    </div>
  )
}
