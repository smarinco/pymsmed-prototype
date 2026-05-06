import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit, XCircle, Plus, ClipboardList, FileText } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { SolicitudEdicionModal } from '../components/SolicitudEdicionModal'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EntornoComunitario, Visita } from '@/shared/types/domain'

const tipoEspacioLabels: Record<string, string> = {
  centro_comunitario: 'Centro Comunitario',
  parque: 'Parque',
  cancha: 'Cancha',
  salon_comunal: 'Salón Comunal',
  iglesia: 'Iglesia',
  sede_social: 'Sede Social',
  espacio_publico: 'Espacio Público',
  otro: 'Otro',
}

const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable',
  salud_mental: 'Salud Mental',
  convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad',
  seguridad_alimentaria: 'Seguridad Alimentaria',
  salud_ambiental: 'Salud Ambiental',
  salud_bucal: 'Salud Bucal',
}

export function EntornoComunitarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entorno, setEntorno] = useState<EntornoComunitario | null>(null)
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [solicitudOpen, setSolicitudOpen] = useState(false)

  useEffect(() => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const found = entornos.find((e) => e.id === id) ?? null
    setEntorno(found)

    const allVisitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    setVisitas(allVisitas.filter((v) => v.entornoId === id))
  }, [id])

  if (!entorno) {
    return <div className="p-8 text-center text-gray-500">Entorno no encontrado.</div>
  }

  const visitaColumns: Column<Visita>[] = [
    { key: 'fecha', header: 'Fecha', render: (v) => v.fecha },
    { key: 'dimension', header: 'Dimensión', render: (v) => dimensionLabels[v.dimension] || v.dimension },
    { key: 'proyecto', header: 'Proyecto', render: (v) => v.proyecto },
    { key: 'profesional', header: 'Profesional', render: (v) => v.profesionalResponsable },
    { key: 'estado', header: 'Estado', render: (v) => <StatusBadge status={v.estado} /> },
    {
      key: 'acciones',
      header: '',
      render: (v) => (
        <Button variant="ghost" size="sm" icon={<ClipboardList size={14} />} onClick={() => navigate(`/visitas/${v.id}`)}>
          Detalle
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={entorno.nombre}
        subtitle={`${entorno.codigo} — ${tipoEspacioLabels[entorno.tipoEspacio]}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
          { label: entorno.nombre },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/entornos/comunitario/${id}/editar`)}>
              Editar
            </Button>
            {entorno.estado === 'activo' && (
              <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => navigate(`/entornos/comunitario/${id}/inactivar`)}>
                Inactivar
              </Button>
            )}
            <Button variant="ghost" size="sm" icon={<FileText size={14} />} onClick={() => setSolicitudOpen(true)}>
              Solicitar edición
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos generales" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Comuna</dt>
              <dd className="font-medium">{entorno.comuna}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Barrio</dt>
              <dd className="font-medium">{entorno.barrio}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Dirección</dt>
              <dd className="font-medium">{entorno.direccion}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Tipo de espacio</dt>
              <dd className="font-medium">{tipoEspacioLabels[entorno.tipoEspacio]}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Referente comunitario</dt>
              <dd className="font-medium">{entorno.referenteComunitario}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Teléfono</dt>
              <dd className="font-medium">{entorno.telefonoContacto}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-gray-500">Observaciones</dt>
              <dd className="font-medium">{entorno.observaciones || '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Estado">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Estado</span>
              <StatusBadge status={entorno.estado} />
            </div>
            {entorno.motivoInactivacion && (
              <div>
                <span className="text-xs text-gray-500">Motivo inactivación</span>
                <p className="text-sm mt-1">{entorno.motivoInactivacion}</p>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Creado: {new Date(entorno.creadoEn).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title={`Visitas (${visitas.length})`}
        actions={
          entorno.estado === 'activo' ? (
            <Button size="sm" icon={<Plus size={14} />} onClick={() => navigate(`/entornos/comunitario/${id}/visitas/nueva`)}>
              Nueva visita
            </Button>
          ) : undefined
        }
      >
        <DataTable columns={visitaColumns} data={visitas} emptyMessage="No hay visitas registradas para este entorno." />
      </Card>

      <SolicitudEdicionModal
        open={solicitudOpen}
        onClose={() => setSolicitudOpen(false)}
        entidadTipo="entorno"
        entidadId={entorno.id}
        entidadNombre={entorno.nombre}
      />
    </div>
  )
}
