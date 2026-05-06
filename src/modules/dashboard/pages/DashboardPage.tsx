import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Home, ClipboardList, Users, FileText, ArrowRightLeft,
  CalendarDays, BarChart3, AlertTriangle, Activity,
} from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  EntornoComunitario, Visita, Solicitud, Participante,
  Canalizacion, ActividadColectiva, Hogar, Atencion,
} from '@/shared/types/domain'

interface StatCard {
  label: string
  value: number
  sub?: string
  icon: React.ReactNode
  color: string
  to: string
}

interface QuickAction {
  icon: React.ReactNode
  iconColor: string
  label: string
  desc: string
  to: string
}

export function DashboardPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<StatCard[]>([])
  const [alerts, setAlerts] = useState<{ text: string; color: string }[]>([])

  useEffect(() => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const hogares: Hogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]')
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
    const atenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')
    const solicitudes: Solicitud[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.solicitudes) || '[]')
    const canalizaciones: Canalizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.canalizaciones) || '[]')
    const actividades: ActividadColectiva[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.actividades) || '[]')

    const canPendientes = canalizaciones.filter(c => ['generada', 'asignada', 'reprogramada'].includes(c.estado)).length
    const solPendientes = solicitudes.filter(s => s.estado === 'pendiente').length
    const sinAtencion = participantes.filter(p => p.semaforo === 'rojo').length

    setStats([
      { label: 'Entornos Activos', value: entornos.filter(e => e.estado === 'activo').length, icon: <MapPin size={22} />, color: 'bg-blue-500', to: '/entornos/comunitario' },
      { label: 'Hogares', value: hogares.filter(h => h.estado === 'activo').length, icon: <Home size={22} />, color: 'bg-emerald-500', to: '/hogares' },
      { label: 'Visitas Abiertas', value: visitas.filter(v => v.estado === 'abierta').length, sub: `${visitas.length} totales`, icon: <ClipboardList size={22} />, color: 'bg-green-500', to: '/visitas' },
      { label: 'Participantes', value: participantes.length, sub: `${sinAtencion} sin atención`, icon: <Users size={22} />, color: 'bg-purple-500', to: '/participantes' },
      { label: 'Canalizaciones', value: canPendientes, sub: 'pendientes', icon: <ArrowRightLeft size={22} />, color: 'bg-orange-500', to: '/canalizaciones' },
      { label: 'Actividades', value: actividades.filter(a => a.estado === 'aprobada' || a.estado === 'programada').length, sub: 'por realizar', icon: <CalendarDays size={22} />, color: 'bg-teal-500', to: '/actividades' },
      { label: 'Solicitudes', value: solPendientes, sub: 'pendientes', icon: <FileText size={22} />, color: 'bg-yellow-500', to: '/solicitudes' },
      { label: 'Atenciones', value: atenciones.filter(a => a.estado === 'finalizada').length, sub: `de ${atenciones.length}`, icon: <Activity size={22} />, color: 'bg-indigo-500', to: '/reportes' },
    ])

    // Alertas dinámicas
    const newAlerts: { text: string; color: string }[] = []
    if (canPendientes > 0) newAlerts.push({ text: `${canPendientes} canalización(es) pendiente(s) de gestión EAPB.`, color: 'bg-orange-400' })
    if (solPendientes > 0) newAlerts.push({ text: `${solPendientes} solicitud(es) pendiente(s) de revisión.`, color: 'bg-yellow-400' })
    if (sinAtencion > 3) newAlerts.push({ text: `${sinAtencion} participantes sin ninguna atención registrada.`, color: 'bg-red-400' })
    const actProgramadas = actividades.filter(a => a.estado === 'programada').length
    if (actProgramadas > 0) newAlerts.push({ text: `${actProgramadas} actividad(es) pendiente(s) de aprobación.`, color: 'bg-blue-400' })
    setAlerts(newAlerts)
  }, [])

  const quickActions: QuickAction[] = [
    { icon: <MapPin size={18} />, iconColor: 'text-blue-500', label: 'Entornos Comunitarios', desc: 'Crear, consultar o editar registros', to: '/entornos/comunitario' },
    { icon: <Home size={18} />, iconColor: 'text-emerald-500', label: 'Entorno Hogar', desc: 'Hogares, integrantes y caracterizaciones', to: '/hogares' },
    { icon: <ArrowRightLeft size={18} />, iconColor: 'text-orange-500', label: 'Canalizaciones', desc: 'Seguimiento de atenciones canalizadas', to: '/canalizaciones' },
    { icon: <CalendarDays size={18} />, iconColor: 'text-teal-500', label: 'Actividades Colectivas', desc: 'Cronograma y registro de actividades', to: '/actividades' },
    { icon: <BarChart3 size={18} />, iconColor: 'text-indigo-500', label: 'Reportes', desc: 'Indicadores y tableros operativos', to: '/reportes' },
    { icon: <FileText size={18} />, iconColor: 'text-yellow-500', label: 'Solicitudes', desc: 'Ediciones, reaperturas y aprobaciones', to: '/solicitudes' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {usuario.nombre}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Panel de control PYMSMED — {usuario.contrato.proyecto} • Contrato {usuario.contrato.numero}
        </p>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${alert.color} shrink-0`} />
              <span className="text-sm text-gray-700">{alert.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => navigate(stat.to)}
            className="flex items-center gap-3 rounded-lg bg-white border p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className={`${stat.color} rounded-lg p-2.5 text-white shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-500 truncate">{stat.label}</div>
              {stat.sub && <div className="text-[10px] text-gray-400">{stat.sub}</div>}
            </div>
          </button>
        ))}
      </div>

      {/* Quick actions + info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Activity size={16} />
            Accesos rápidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.to}
                onClick={() => navigate(action.to)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-left hover:bg-gray-50 border transition-colors"
              >
                <span className={action.iconColor}>{action.icon}</span>
                <div>
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            Acerca del prototipo
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex gap-2 items-start">
              <span className="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span><strong>Prototipo funcional</strong> para validación de flujos con la Secretaría de Salud.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span>Datos en <strong>localStorage</strong>. Use "Reset demo" para restaurar.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span>Cambie de <strong>usuario/rol</strong> en la barra superior.</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span>No requiere backend, internet ni login real.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
