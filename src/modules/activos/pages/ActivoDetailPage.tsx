import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, MapPin } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
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

const estadoConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  activo: { label: 'Activo', variant: 'success' },
  inactivo: { label: 'Inactivo', variant: 'danger' },
  en_verificacion: { label: 'En verificación', variant: 'warning' },
}

export function ActivoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activo, setActivo] = useState<ActivoTerritorial | null>(null)

  useEffect(() => {
    const all: ActivoTerritorial[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.activos) || '[]')
    setActivo(all.find((a) => a.id === id) ?? null)
  }, [id])

  if (!activo) return <div className="p-8 text-center text-gray-500">Activo no encontrado.</div>

  const catCfg = categoriaConfig[activo.categoria]
  const estCfg = estadoConfig[activo.estado]

  return (
    <div>
      <PageHeader
        title={activo.nombre}
        subtitle={`${activo.codigo} — Activo Territorial`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Mapeo de Activos', to: '/mapeo-activos' }, { label: activo.nombre }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/mapeo-activos')}>Volver</Button>
            <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/mapeo-activos/${id}/editar`)}>Editar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos del activo" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="text-gray-500">Nombre</dt><dd className="font-medium">{activo.nombre}</dd></div>
            <div><dt className="text-gray-500">Categoría</dt><dd><Badge variant={catCfg.variant}>{catCfg.label}</Badge></dd></div>
            <div><dt className="text-gray-500">Comuna</dt><dd className="font-medium">{activo.comuna}</dd></div>
            <div><dt className="text-gray-500">Barrio</dt><dd className="font-medium">{activo.barrio}</dd></div>
            <div><dt className="text-gray-500">Dirección</dt><dd className="font-medium">{activo.direccion}</dd></div>
            <div><dt className="text-gray-500">Responsable</dt><dd className="font-medium">{activo.responsable}</dd></div>
            <div><dt className="text-gray-500">Teléfono</dt><dd className="font-medium">{activo.telefono || '—'}</dd></div>
            <div><dt className="text-gray-500">Estado</dt><dd><Badge variant={estCfg.variant}>{estCfg.label}</Badge></dd></div>
            <div className="col-span-2"><dt className="text-gray-500">Descripción</dt><dd className="font-medium">{activo.descripcion}</dd></div>
            {activo.observaciones && (
              <div className="col-span-2"><dt className="text-gray-500">Observaciones</dt><dd className="font-medium">{activo.observaciones}</dd></div>
            )}
          </dl>
        </Card>

        <Card title="Jornadas asociadas">
          {activo.jornadasAsociadas.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">Sin jornadas asociadas.</div>
          ) : (
            <div className="space-y-2">
              {activo.jornadasAsociadas.map((j, i) => (
                <div key={i} className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                  <MapPin size={14} className="text-[var(--pyms-secondary)] shrink-0" />
                  {j}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
