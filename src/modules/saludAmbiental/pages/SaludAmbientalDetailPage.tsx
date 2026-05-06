import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { CaracterizacionAmbiental, SeguimientoAmbiental, NivelRiesgoAmbiental, DimensionAmbiental } from '@/shared/types/domain'

const dimensionLabels: Record<DimensionAmbiental, string> = {
  agua_saneamiento: 'Agua y Saneamiento',
  residuos_solidos: 'Residuos Sólidos',
  vectores_plagas: 'Vectores y Plagas',
  calidad_aire: 'Calidad del Aire',
  suelo_vivienda: 'Suelo y Vivienda',
}

const tipoZonaLabels: Record<string, string> = {
  residencial: 'Residencial', comercial: 'Comercial', industrial: 'Industrial', rural: 'Rural', mixta: 'Mixta',
}

const riesgoConfig: Record<NivelRiesgoAmbiental, { label: string; variant: 'default' | 'success' | 'info' | 'warning' | 'danger'; color: string }> = {
  sin_riesgo: { label: 'Sin riesgo', variant: 'default', color: 'bg-gray-200' },
  bajo: { label: 'Bajo', variant: 'success', color: 'bg-green-500' },
  medio: { label: 'Medio', variant: 'warning', color: 'bg-yellow-400' },
  alto: { label: 'Alto', variant: 'danger', color: 'bg-orange-500' },
  critico: { label: 'Crítico', variant: 'danger', color: 'bg-red-600' },
}

export function SaludAmbientalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CaracterizacionAmbiental | null>(null)
  const [seguimientos, setSeguimientos] = useState<SeguimientoAmbiental[]>([])

  useEffect(() => {
    const all: CaracterizacionAmbiental[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizacionesAmbientales) || '[]')
    setCar(all.find((c) => c.id === id) ?? null)
    const segs: SeguimientoAmbiental[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.seguimientosAmbientales) || '[]')
    setSeguimientos(segs.filter((s) => s.caracterizacionId === id))
  }, [id])

  if (!car) return <div className="p-8 text-center text-gray-500">Caracterización no encontrada.</div>

  const rCfg = riesgoConfig[car.riesgoGeneral]
  const seccionesCompletadas = car.secciones.filter((s) => s.completada).length

  return (
    <div>
      <PageHeader
        title={car.ubicacion}
        subtitle={`${car.codigo} — Caracterización Ambiental`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Salud Ambiental', to: '/salud-ambiental' }, { label: car.codigo }]}
        actions={
          <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/salud-ambiental')}>Volver</Button>
        }
      />

      {/* Info + Riesgo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos generales" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="text-gray-500">Ubicación</dt><dd className="font-medium">{car.ubicacion}</dd></div>
            <div><dt className="text-gray-500">Comuna</dt><dd className="font-medium">{car.comuna}</dd></div>
            <div><dt className="text-gray-500">Barrio</dt><dd className="font-medium">{car.barrio}</dd></div>
            <div><dt className="text-gray-500">Tipo de zona</dt><dd className="font-medium">{tipoZonaLabels[car.tipoZona]}</dd></div>
            <div><dt className="text-gray-500">Profesional</dt><dd className="font-medium">{car.profesional}</dd></div>
            <div><dt className="text-gray-500">Fecha</dt><dd className="font-medium">{car.fecha}</dd></div>
            <div><dt className="text-gray-500">Estado</dt><dd><Badge variant={car.estado === 'completada' ? 'success' : 'warning'}>{car.estado === 'completada' ? 'Completada' : `En progreso (${seccionesCompletadas}/5)`}</Badge></dd></div>
          </dl>
        </Card>

        <Card title="Nivel de riesgo general">
          <div className="flex flex-col items-center py-4">
            <div className={`w-20 h-20 rounded-full ${rCfg.color} flex items-center justify-center mb-3`}>
              <ShieldAlert size={32} className="text-white" />
            </div>
            <Badge variant={rCfg.variant}>{rCfg.label}</Badge>
            {car.recomendaciones && (
              <p className="text-xs text-gray-600 text-center mt-3">{car.recomendaciones}</p>
            )}
          </div>
        </Card>
      </div>

      {/* Secciones */}
      <Card title="Dimensiones evaluadas" className="mb-6">
        <div className="space-y-4">
          {car.secciones.map((sec) => {
            const sCfg = riesgoConfig[sec.nivelRiesgo]
            return (
              <div key={sec.dimension} className={`rounded-lg border p-4 ${sec.completada ? '' : 'opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{dimensionLabels[sec.dimension]}</h4>
                    {sec.completada ? (
                      <Badge variant={sCfg.variant}>{sCfg.label}</Badge>
                    ) : (
                      <Badge variant="default">Pendiente</Badge>
                    )}
                  </div>
                  {sec.completada && (
                    <div className={`w-3 h-3 rounded-full ${sCfg.color}`} title={sCfg.label} />
                  )}
                </div>
                {sec.completada && (
                  <>
                    {/* Respuestas */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(sec.respuestas).map(([key, val]) => (
                        <span key={key} className="text-xs bg-gray-100 rounded px-2 py-1">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)}
                        </span>
                      ))}
                    </div>
                    {sec.observaciones && (
                      <p className="text-xs text-gray-600 italic">{sec.observaciones}</p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Seguimientos */}
      {seguimientos.length > 0 && (
        <Card title={`Seguimientos (${seguimientos.length})`}>
          <div className="space-y-4">
            {seguimientos.map((s) => {
              const nrCfg = riesgoConfig[s.nuevoRiesgoGeneral]
              return (
                <div key={s.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{s.fecha}</span>
                      <span className="text-xs text-gray-500">{s.profesional}</span>
                    </div>
                    <Badge variant={nrCfg.variant}>Riesgo: {nrCfg.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{s.observaciones}</p>
                  {s.cambiosRiesgo.length > 0 && (
                    <div className="space-y-1">
                      {s.cambiosRiesgo.map((cr, i) => {
                        const crCfg = riesgoConfig[cr.nuevoNivel]
                        return (
                          <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{dimensionLabels[cr.dimension]}:</span>
                            <Badge variant={crCfg.variant}>{crCfg.label}</Badge>
                            <span>— {cr.nota}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
