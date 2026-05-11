import { NavLink, Outlet } from 'react-router-dom'
import { FileText, ClipboardList, Shield, Settings2 } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'

const tabs = [
  { to: '/administracion/contratos', icon: FileText, label: 'Contratos' },
  { to: '/administracion/solicitudes', icon: ClipboardList, label: 'Solicitudes' },
  { to: '/administracion/auditoria', icon: Shield, label: 'Auditoría' },
  { to: '/administracion/opciones', icon: Settings2, label: 'Opciones' },
]

export function AdminLayout() {
  return (
    <div>
      <PageHeader
        title="Administración"
        subtitle="Contratos, solicitudes, auditoría y opciones del módulo PYMSMED"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Administración' }]}
      />

      <nav className="flex gap-1 mb-6 border-b border-gray-100">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <tab.icon size={16} />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
