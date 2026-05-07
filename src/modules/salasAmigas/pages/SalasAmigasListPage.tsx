import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Baby } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EmpresaSalaAmiga, EstadoEmpresaSala } from '@/shared/types/domain'

const estadoConfig: Record<EstadoEmpresaSala, { label: string; variant: 'default' | 'success' | 'info' | 'warning' | 'danger' }> = {
  identificada: { label: 'Identificada', variant: 'default' },
  socializada: { label: 'Socializada', variant: 'info' },
  en_implementacion: { label: 'En implementación', variant: 'warning' },
  certificada: { label: 'Certificada', variant: 'success' },
  no_aplica: { label: 'No aplica', variant: 'default' },
}

export function SalasAmigasListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<EmpresaSalaAmiga[]>([])
  const [filtered, setFiltered] = useState<EmpresaSalaAmiga[]>([])
  const [estadoFilter, setEstadoFilter] = useState('todas')

  useEffect(() => {
    const items: EmpresaSalaAmiga[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.empresasSala) || '[]')
    setData(items)
    setFiltered(items)
  }, [])

  useEffect(() => {
    setFiltered(estadoFilter === 'todas' ? data : data.filter((e) => e.estado === estadoFilter))
  }, [data, estadoFilter])

  const handleSearch = (q: string) => {
    const query = q.toLowerCase()
    let result = data
    if (estadoFilter !== 'todas') result = result.filter((e) => e.estado === estadoFilter)
    setFiltered(result.filter((e) =>
      e.nombreEmpresa.toLowerCase().includes(query) || e.codigo.toLowerCase().includes(query) ||
      e.comuna.toLowerCase().includes(query) || e.nit.includes(query)
    ))
  }

  const counts = {
    certificada: data.filter((e) => e.estado === 'certificada').length,
    en_implementacion: data.filter((e) => e.estado === 'en_implementacion').length,
    socializada: data.filter((e) => e.estado === 'socializada').length,
    identificada: data.filter((e) => e.estado === 'identificada').length,
  }

  const columns: Column<EmpresaSalaAmiga>[] = [
    { key: 'codigo', header: 'Código', render: (e) => <span className="font-mono text-xs">{e.codigo}</span> },
    {
      key: 'nombre', header: 'Empresa',
      render: (e) => (
        <button onClick={() => navigate(`/salas-amigas/${e.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {e.nombreEmpresa}
        </button>
      ),
    },
    { key: 'sector', header: 'Sector', render: (e) => e.sectorEconomico },
    { key: 'comuna', header: 'Comuna', render: (e) => e.comuna },
    { key: 'trabajadores', header: 'Trabajadores', render: (e) => e.numTrabajadores },
    { key: 'mujeres', header: 'Mujeres EF', render: (e) => e.numMujeresEdadFertil },
    { key: 'sala', header: 'Sala', render: (e) => e.tieneSalaAmiga ? <Badge variant="success">Sí</Badge> : <Badge variant="default">No</Badge> },
    { key: 'estado', header: 'Estado', render: (e) => { const c = estadoConfig[e.estado]; return <Badge variant={c.variant}>{c.label}</Badge> } },
    { key: 'acciones', header: '', render: (e) => <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/salas-amigas/${e.id}`)}>Ver</Button> },
  ]

  return (
    <div>
      <PageHeader
        title="Salas Amigas de la Familia Lactante"
        subtitle="Empresas, socialización de norma y seguimientos de lactancia materna"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Salas Amigas' }]}
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/salas-amigas/nueva')}>Nueva empresa</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {([
          { key: 'certificada', label: 'Certificadas', color: 'text-green-600' },
          { key: 'en_implementacion', label: 'En implementación', color: 'text-yellow-600' },
          { key: 'socializada', label: 'Socializadas', color: 'text-blue-600' },
          { key: 'identificada', label: 'Identificadas', color: 'text-gray-600' },
        ] as const).map((s) => (
          <button key={s.key} onClick={() => setEstadoFilter(estadoFilter === s.key ? 'todas' : s.key)}
            className={`rounded-lg border p-3 text-center transition-colors ${estadoFilter === s.key ? 'bg-gray-100 border-gray-400' : 'bg-white hover:bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{counts[s.key]}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No hay empresas registradas."
        searchPlaceholder="Buscar por empresa, NIT, código o comuna..." onSearch={handleSearch} />
    </div>
  )
}
