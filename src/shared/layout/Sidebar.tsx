import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Home,
  GraduationCap,
  Briefcase,
  Building2,
  ClipboardList,
  Users,
  FileText,
  CalendarDays,
  Settings,
  ArrowRightLeft,
  BarChart3,
  Leaf,
  Map,
  Baby,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const entornoItems = [
  { to: '/entornos/comunitario', icon: MapPin, label: 'Comunitario' },
  { to: '/hogares', icon: Home, label: 'Hogar' },
  { to: '/entornos/educativo', icon: GraduationCap, label: 'Educativo' },
  { to: '/entornos/laboral', icon: Briefcase, label: 'Laboral' },
  { to: '/entornos/institucional', icon: Building2, label: 'Institucional' },
]

const otherItems = [
  { to: '/visitas', icon: ClipboardList, label: 'Visitas' },
  { to: '/participantes', icon: Users, label: 'Participantes' },
  { to: '/salud-ambiental', icon: Leaf, label: 'Salud Ambiental' },
  { to: '/mapeo-activos', icon: Map, label: 'Mapeo de Activos' },
  { to: '/salas-amigas', icon: Baby, label: 'Salas Amigas' },
  { to: '/actividades', icon: CalendarDays, label: 'Actividades Colectivas' },
  { to: '/formularios', icon: FileSpreadsheet, label: 'Formularios' },
  { to: '/canalizaciones', icon: ArrowRightLeft, label: 'Canalizaciones' },
  { to: '/reportes', icon: BarChart3, label: 'Reportes' },
  { to: '/solicitudes', icon: FileText, label: 'Solicitudes' },
  { to: '/administracion', icon: Settings, label: 'Administración' },
]

function NavItem({ to, icon: Icon, label, open: sidebarOpen }: { to: string; icon: React.ComponentType<{ size: number }>; label: string; open: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive ? 'bg-[var(--pyms-secondary)] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon size={18} />
      {sidebarOpen && <span>{label}</span>}
    </NavLink>
  )
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const location = useLocation()
  const isEntornoActive = location.pathname.startsWith('/entornos') || location.pathname.startsWith('/hogares')
  const [entornosOpen, setEntornosOpen] = useState(isEntornoActive)

  return (
    <aside
      className={`${open ? 'w-64' : 'w-16'} flex flex-col bg-[var(--pyms-sidebar)] text-white transition-all duration-200 ease-in-out`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        {open && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[var(--pyms-accent)] flex items-center justify-center text-sm font-bold">P</div>
            <span className="font-semibold text-sm">PYMSMED</span>
          </div>
        )}
        <button onClick={onToggle} className="p-1 rounded hover:bg-white/10 transition-colors" title={open ? 'Colapsar' : 'Expandir'}>
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" open={open} />

        {/* Entornos group */}
        {open ? (
          <div>
            <button
              onClick={() => setEntornosOpen(!entornosOpen)}
              className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                isEntornoActive ? 'text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Entornos</span>
              </span>
              <ChevronDown size={14} className={`transition-transform ${entornosOpen ? 'rotate-180' : ''}`} />
            </button>
            {entornosOpen && (
              <div className="ml-4 pl-3 border-l border-white/10 space-y-0.5 mt-1">
                {entornoItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive ? 'bg-[var(--pyms-secondary)] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={14} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavItem to="/entornos/comunitario" icon={MapPin} label="Entornos" open={false} />
        )}

        {otherItems.map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} open={open} />
        ))}
      </nav>

      {/* Footer */}
      {open && (
        <div className="p-4 border-t border-white/10 text-xs text-gray-500">
          PYMSMED v0.1 — Prototipo
        </div>
      )}
    </aside>
  )
}
