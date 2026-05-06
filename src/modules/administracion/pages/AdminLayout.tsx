import { NavLink, Outlet } from 'react-router-dom'
import { FileText, ClipboardList, Shield } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'

const tabs = [
  { to: '/administracion/contratos', icon: FileText, label: 'Contratos' },
  { to: '/administracion/solicitudes', icon: ClipboardList, label: 'Solicitudes' },
  { to: '/administracion/auditoria', icon: Shield, label: 'Auditoría' },
]

export function AdminLayout() {
  return (
    <div>
      <PageHeader
        title="Administración"
        subtitle="Contratos, solicitudes y auditoría del módulo PYMSMED"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Administración' }]}
      />

      <nav className="flex gap-1 mb-6 border-b">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'border-[var(--pyms-primary)] text-[var(--pyms-primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
