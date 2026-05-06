import { useEffect, useState } from 'react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  EntornoComunitario, Visita, Participante, Atencion,
  Canalizacion, ActividadColectiva, Hogar, Solicitud,
} from '@/shared/types/domain'
import type { EntornoGenerico } from '@/modules/entornos/generic/seed-entornos'

interface BarProps {
  label: string
  value: number
  max: number
  color: string
}

function Bar({ label, value, max, color }: BarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: string
}

function StatCard({ label, value, sub, color = 'text-gray-800' }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export function ReportesPage() {
  const [data, setData] = useState<{
    entornos: EntornoComunitario[]
    educativos: EntornoGenerico[]
    laborales: EntornoGenerico[]
    institucionales: EntornoGenerico[]
    hogares: Hogar[]
    visitas: Visita[]
    participantes: Participante[]
    atenciones: Atencion[]
    canalizaciones: Canalizacion[]
    actividades: ActividadColectiva[]
    solicitudes: Solicitud[]
  } | null>(null)

  useEffect(() => {
    setData({
      entornos: JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]'),
      educativos: JSON.parse(localStorage.getItem('pyms_entornos_educativos') || '[]'),
      laborales: JSON.parse(localStorage.getItem('pyms_entornos_laborales') || '[]'),
      institucionales: JSON.parse(localStorage.getItem('pyms_entornos_institucionales') || '[]'),
      hogares: JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]'),
      visitas: JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]'),
      participantes: JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]'),
      atenciones: JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]'),
      canalizaciones: JSON.parse(localStorage.getItem(STORAGE_KEYS.canalizaciones) || '[]'),
      actividades: JSON.parse(localStorage.getItem(STORAGE_KEYS.actividades) || '[]'),
      solicitudes: JSON.parse(localStorage.getItem(STORAGE_KEYS.solicitudes) || '[]'),
    })
  }, [])

  if (!data) return null

  const totalEntornos =
    data.entornos.length + data.educativos.length + data.laborales.length +
    data.institucionales.length + data.hogares.length

  const visitasAbiertas = data.visitas.filter((v) => v.estado === 'abierta').length
  const visitasCerradas = data.visitas.filter((v) => v.estado === 'cerrada').length

  const semaforoRojo = data.participantes.filter((p) => p.semaforo === 'rojo').length
  const semaforoAmarillo = data.participantes.filter((p) => p.semaforo === 'amarillo').length
  const semaforoVerde = data.participantes.filter((p) => p.semaforo === 'verde').length

  const atencionesAbiertas = data.atenciones.filter((a) => a.estado === 'abierta').length
  const atencionesFinalizadas = data.atenciones.filter((a) => a.estado === 'finalizada').length

  const canPendientes = data.canalizaciones.filter((c) => ['generada', 'asignada', 'reprogramada'].includes(c.estado)).length
  const canAtendidas = data.canalizaciones.filter((c) => c.estado === 'atendida' || c.estado === 'cerrada').length
  const canRechazadas = data.canalizaciones.filter((c) => c.estado === 'rechazada').length

  const actProgramadas = data.actividades.filter((a) => a.estado === 'programada').length
  const actAprobadas = data.actividades.filter((a) => a.estado === 'aprobada').length
  const actRealizadas = data.actividades.filter((a) => a.estado === 'realizada').length
  const totalParticipantesAct = data.actividades
    .filter((a) => a.estado === 'realizada')
    .reduce((sum, a) => sum + (a.participantesReales || 0), 0)

  const solPendientes = data.solicitudes.filter((s) => s.estado === 'pendiente').length

  const maxEntorno = Math.max(
    data.entornos.length, data.hogares.length, data.educativos.length,
    data.laborales.length, data.institucionales.length, 1,
  )

  return (
    <div>
      <PageHeader
        title="Reportes y Analítica"
        subtitle="Indicadores operativos del módulo PYMSMED"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Reportes' }]}
      />

      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Entornos totales" value={totalEntornos} color="text-blue-600" />
        <StatCard label="Visitas" value={data.visitas.length} sub={`${visitasAbiertas} abiertas`} color="text-green-600" />
        <StatCard label="Participantes" value={data.participantes.length} color="text-purple-600" />
        <StatCard label="Atenciones" value={data.atenciones.length} sub={`${atencionesFinalizadas} finalizadas`} color="text-indigo-600" />
        <StatCard label="Canalizaciones" value={data.canalizaciones.length} sub={`${canPendientes} pendientes`} color="text-orange-600" />
        <StatCard label="Actividades" value={data.actividades.length} sub={`${totalParticipantesAct} personas atendidas`} color="text-teal-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Entornos por tipo */}
        <Card title="Entornos por tipo">
          <div className="space-y-3">
            <Bar label="Comunitario" value={data.entornos.length} max={maxEntorno} color="bg-blue-500" />
            <Bar label="Hogar" value={data.hogares.length} max={maxEntorno} color="bg-green-500" />
            <Bar label="Educativo" value={data.educativos.length} max={maxEntorno} color="bg-yellow-500" />
            <Bar label="Laboral" value={data.laborales.length} max={maxEntorno} color="bg-purple-500" />
            <Bar label="Institucional" value={data.institucionales.length} max={maxEntorno} color="bg-red-500" />
          </div>
        </Card>

        {/* Semaforización */}
        <Card title="Semaforización de participantes">
          <div className="flex items-end gap-6 justify-center py-4">
            {[
              { label: 'Sin atención', value: semaforoRojo, color: 'bg-red-500' },
              { label: 'Parcial', value: semaforoAmarillo, color: 'bg-yellow-400' },
              { label: 'Completa', value: semaforoVerde, color: 'bg-green-500' },
            ].map((item) => {
              const maxSem = Math.max(semaforoRojo, semaforoAmarillo, semaforoVerde, 1)
              const h = Math.max((item.value / maxSem) * 120, 8)
              return (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <span className="text-lg font-bold">{item.value}</span>
                  <div className={`w-16 rounded-t ${item.color}`} style={{ height: `${h}px` }} />
                  <span className="text-xs text-gray-500 text-center">{item.label}</span>
                </div>
              )
            })}
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            {data.participantes.length} participantes totales
          </div>
        </Card>

        {/* Visitas */}
        <Card title="Estado de visitas">
          <div className="space-y-3">
            <Bar label="Abiertas" value={visitasAbiertas} max={data.visitas.length || 1} color="bg-blue-500" />
            <Bar label="Cerradas" value={visitasCerradas} max={data.visitas.length || 1} color="bg-gray-400" />
          </div>
          <div className="mt-4 pt-3 border-t">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Visitas por dimensión</h4>
            <div className="space-y-2">
              {Object.entries(
                data.visitas.reduce<Record<string, number>>((acc, v) => {
                  acc[v.dimension] = (acc[v.dimension] || 0) + 1
                  return acc
                }, {}),
              ).sort((a, b) => b[1] - a[1]).map(([dim, count]) => (
                <div key={dim} className="flex justify-between text-xs">
                  <span className="text-gray-600 capitalize">{dim.replace(/_/g, ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Canalizaciones */}
        <Card title="Estado de canalizaciones">
          <div className="space-y-3">
            <Bar label="Pendientes (generada/asignada/reprogramada)" value={canPendientes} max={data.canalizaciones.length || 1} color="bg-yellow-500" />
            <Bar label="Atendidas / Cerradas" value={canAtendidas} max={data.canalizaciones.length || 1} color="bg-green-500" />
            <Bar label="Rechazadas" value={canRechazadas} max={data.canalizaciones.length || 1} color="bg-red-500" />
          </div>
          <div className="mt-4 pt-3 border-t">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Por prioridad</h4>
            <div className="flex gap-2 flex-wrap">
              {['urgente', 'alta', 'media', 'baja'].map((p) => {
                const count = data.canalizaciones.filter((c) => c.prioridad === p).length
                if (count === 0) return null
                const variant = p === 'urgente' ? 'danger' : p === 'alta' ? 'warning' : p === 'media' ? 'info' : 'default'
                return <Badge key={p} variant={variant as 'danger' | 'warning' | 'info' | 'default'}>{p}: {count}</Badge>
              })}
            </div>
          </div>
        </Card>

        {/* Actividades Colectivas */}
        <Card title="Actividades Colectivas">
          <div className="space-y-3">
            <Bar label="Programadas" value={actProgramadas} max={data.actividades.length || 1} color="bg-blue-500" />
            <Bar label="Aprobadas" value={actAprobadas} max={data.actividades.length || 1} color="bg-green-500" />
            <Bar label="Realizadas" value={actRealizadas} max={data.actividades.length || 1} color="bg-purple-500" />
          </div>
          <div className="mt-4 pt-3 border-t text-center">
            <div className="text-2xl font-bold text-purple-600">{totalParticipantesAct}</div>
            <div className="text-xs text-gray-500">Personas atendidas en actividades realizadas</div>
          </div>
        </Card>

        {/* Solicitudes + Atenciones */}
        <Card title="Operativo">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">Atenciones</h4>
              <div className="space-y-2">
                <Bar label="Abiertas" value={atencionesAbiertas} max={data.atenciones.length || 1} color="bg-yellow-500" />
                <Bar label="Finalizadas" value={atencionesFinalizadas} max={data.atenciones.length || 1} color="bg-green-500" />
              </div>
            </div>
            <div className="border-t pt-3">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">Solicitudes</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pendientes de revisión</span>
                <span className={`text-lg font-bold ${solPendientes > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{solPendientes}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-lg border bg-blue-50 border-blue-200 p-4 text-sm text-blue-800">
        <strong>Nota:</strong> Estos indicadores se calculan en tiempo real desde los datos en localStorage.
        En producción se generarán desde consultas al backend con filtros por contrato, fecha y territorio.
        TODO-BACKEND: Implementar endpoints de reportes agregados.
      </div>
    </div>
  )
}
