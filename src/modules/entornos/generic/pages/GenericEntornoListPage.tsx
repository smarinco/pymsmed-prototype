import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import type { EntornoConfig } from '../entorno-config'
import type { EntornoGenerico } from '../seed-entornos'
import { getSeedByTipo } from '../seed-entornos'

interface Props {
  config: EntornoConfig
}

export function GenericEntornoListPage({ config }: Props) {
  const navigate = useNavigate()
  const basePath = `/entornos/${config.tipo}`
  const [data, setData] = useState<EntornoGenerico[]>([])
  const [filtered, setFiltered] = useState<EntornoGenerico[]>([])

  useEffect(() => {
    let items: EntornoGenerico[] = JSON.parse(localStorage.getItem(config.storageKey) || 'null')
    if (!items) {
      items = getSeedByTipo(config.tipo)
      localStorage.setItem(config.storageKey, JSON.stringify(items))
    }
    setData(items)
    setFiltered(items)
  }, [config])

  const handleSearch = (query: string) => {
    const q = query.toLowerCase()
    setFiltered(data.filter((e) =>
      String(e.codigo).toLowerCase().includes(q) ||
      String(e.nombre || '').toLowerCase().includes(q) ||
      String(e.comuna || '').toLowerCase().includes(q) ||
      String(e.barrio || '').toLowerCase().includes(q) ||
      String(e.nombreInstitucion || e.nombreEmpresa || '').toLowerCase().includes(q)
    ))
  }

  const columns: Column<EntornoGenerico>[] = [
    { key: 'codigo', header: 'Código', render: (e) => <span className="font-mono text-xs">{e.codigo}</span> },
    {
      key: 'nombre', header: 'Nombre',
      render: (e) => (
        <button onClick={() => navigate(`${basePath}/${e.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {String(e.nombre || e.nombreInstitucion || e.nombreEmpresa || '')}
        </button>
      ),
    },
    { key: 'comuna', header: 'Comuna', render: (e) => String(e.comuna || '') },
    { key: 'barrio', header: 'Barrio', render: (e) => String(e.barrio || '') },
    { key: 'responsable', header: 'Responsable', render: (e) => String(e.responsable || '') },
    { key: 'estado', header: 'Estado', render: (e) => <StatusBadge status={e.estado} /> },
    {
      key: 'acciones', header: '',
      render: (e) => <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`${basePath}/${e.id}`)}>Ver</Button>,
    },
  ]

  return (
    <div>
      <PageHeader
        title={config.labelPlural}
        subtitle={`Gestión de ${config.labelPlural.toLowerCase()}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: config.labelPlural }]}
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate(`${basePath}/nuevo`)}>Nuevo</Button>}
      />
      <DataTable columns={columns} data={filtered} emptyMessage={`No hay ${config.labelPlural.toLowerCase()}.`}
        searchPlaceholder="Buscar por código, nombre, comuna o barrio..." onSearch={handleSearch} />
    </div>
  )
}
