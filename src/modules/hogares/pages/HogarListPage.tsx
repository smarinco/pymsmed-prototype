import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Home } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Hogar, IntegranteHogar, Caracterizacion } from '@/shared/types/domain'

const tipoViviendaLabels: Record<string, string> = {
  casa: 'Casa', apartamento: 'Apartamento', habitacion: 'Habitación', inquilinato: 'Inquilinato', otro: 'Otro',
}

interface HogarEnriquecido extends Hogar {
  numIntegrantes: number
  tieneCaracterizacion: boolean
  estadoCaracterizacion?: string
}

export function HogarListPage() {
  const navigate = useNavigate()
  const [hogares, setHogares] = useState<HogarEnriquecido[]>([])
  const [filtered, setFiltered] = useState<HogarEnriquecido[]>([])

  useEffect(() => {
    const allHogares: Hogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]')
    const integrantes: IntegranteHogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.integrantes) || '[]')
    const caracterizaciones: Caracterizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizaciones) || '[]')

    const enriched: HogarEnriquecido[] = allHogares.map((h) => {
      const car = caracterizaciones.find((c) => c.hogarId === h.id)
      return {
        ...h,
        numIntegrantes: integrantes.filter((i) => i.hogarId === h.id).length,
        tieneCaracterizacion: !!car,
        estadoCaracterizacion: car?.estado,
      }
    })
    setHogares(enriched)
    setFiltered(enriched)
  }, [])

  const handleSearch = (query: string) => {
    const q = query.toLowerCase()
    setFiltered(hogares.filter((h) =>
      h.codigo.toLowerCase().includes(q) ||
      h.direccion.toLowerCase().includes(q) ||
      h.comuna.toLowerCase().includes(q) ||
      h.barrio.toLowerCase().includes(q)
    ))
  }

  const columns: Column<HogarEnriquecido>[] = [
    { key: 'codigo', header: 'Código', render: (h) => <span className="font-mono text-xs">{h.codigo}</span> },
    {
      key: 'direccion', header: 'Dirección',
      render: (h) => (
        <button onClick={() => navigate(`/hogares/${h.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {h.direccion}
        </button>
      ),
    },
    { key: 'comuna', header: 'Comuna', render: (h) => h.comuna },
    { key: 'barrio', header: 'Barrio', render: (h) => h.barrio },
    { key: 'estrato', header: 'Estrato', render: (h) => h.estrato },
    { key: 'tipo', header: 'Tipo', render: (h) => tipoViviendaLabels[h.tipoVivienda] },
    { key: 'integrantes', header: 'Integrantes', render: (h) => h.numIntegrantes },
    {
      key: 'caracterizacion', header: 'Caracterización',
      render: (h) => h.tieneCaracterizacion
        ? <Badge variant={h.estadoCaracterizacion === 'completada' ? 'success' : 'warning'}>{h.estadoCaracterizacion === 'completada' ? 'Completada' : 'En progreso'}</Badge>
        : <Badge variant="default">Sin iniciar</Badge>,
    },
    { key: 'estado', header: 'Estado', render: (h) => <StatusBadge status={h.estado} /> },
    {
      key: 'acciones', header: '',
      render: (h) => (
        <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/hogares/${h.id}`)}>Ver</Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Entorno Hogar"
        subtitle="Gestión de hogares, integrantes y caracterizaciones"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Entorno Hogar' }]}
        actions={
          <Button icon={<Plus size={16} />} onClick={() => navigate('/hogares/nuevo')}>Nuevo hogar</Button>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No hay hogares registrados."
        searchPlaceholder="Buscar por código, dirección, comuna o barrio..."
        onSearch={handleSearch}
      />
    </div>
  )
}
