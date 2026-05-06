import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit, XCircle, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import type { EntornoConfig, CampoEntorno } from '../entorno-config'
import type { EntornoGenerico } from '../seed-entornos'

interface Props {
  config: EntornoConfig
}

function getLabel(campo: CampoEntorno, value: unknown): string {
  if (campo.type === 'select' && campo.options) {
    const opt = campo.options.find((o) => o.value === value)
    if (opt) return opt.label
  }
  return String(value || '—')
}

export function GenericEntornoDetailPage({ config }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const basePath = `/entornos/${config.tipo}`
  const [entorno, setEntorno] = useState<EntornoGenerico | null>(null)

  useEffect(() => {
    const items: EntornoGenerico[] = JSON.parse(localStorage.getItem(config.storageKey) || '[]')
    setEntorno(items.find((e) => e.id === id) ?? null)
  }, [id, config])

  if (!entorno) return <div className="p-8 text-center text-gray-500">Registro no encontrado.</div>

  const nombre = String(entorno.nombre || entorno.nombreInstitucion || entorno.nombreEmpresa || entorno.codigo)

  return (
    <div>
      <PageHeader
        title={nombre}
        subtitle={`${entorno.codigo} — ${config.label}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: config.labelPlural, to: basePath },
          { label: nombre },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(basePath)}>Volver</Button>
            <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`${basePath}/${id}/editar`)}>Editar</Button>
            {entorno.estado === 'activo' && (
              <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => {
                const motivo = window.prompt('Justificación de inactivación:')
                if (!motivo) return
                const items: EntornoGenerico[] = JSON.parse(localStorage.getItem(config.storageKey) || '[]')
                const idx = items.findIndex((e) => e.id === id)
                if (idx >= 0) {
                  items[idx] = { ...items[idx], estado: 'inactivo', motivoInactivacion: motivo, actualizadoEn: new Date().toISOString() }
                  localStorage.setItem(config.storageKey, JSON.stringify(items))
                  setEntorno(items[idx])
                }
              }}>Inactivar</Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Datos del registro" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {config.campos.map((campo) => {
              const val = entorno[campo.key]
              if (val === undefined || val === null || val === '') return null
              return (
                <div key={campo.key} className={campo.type === 'textarea' ? 'col-span-2' : ''}>
                  <dt className="text-gray-500">{campo.label}</dt>
                  <dd className="font-medium">{getLabel(campo, val)}</dd>
                </div>
              )
            })}
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
                <span className="text-xs text-gray-500">Motivo</span>
                <p className="text-sm mt-1">{String(entorno.motivoInactivacion)}</p>
              </div>
            )}
            <div className="text-xs text-gray-400">
              Creado: {new Date(entorno.creadoEn).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
