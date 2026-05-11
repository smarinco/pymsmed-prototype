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
  Calendar,
  History,
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
  { to: '/formularios', icon: FileSpreadsheet, label: 'Formularios' },
  { to: '/actividades', icon: CalendarDays, label: 'Actividades' },
  { to: '/canalizaciones', icon: ArrowRightLeft, label: 'Canalizaciones' },
  { to: '/historial', icon: History, label: 'Historial' },
  { to: '/calendarizacion', icon: Calendar, label: 'Calendario' },
  { to: '/reportes', icon: BarChart3, label: 'Reportes' },
  { to: '/solicitudes', icon: FileText, label: 'Solicitudes' },
  { to: '/administracion', icon: Settings, label: 'Administración' },
]

function NavItem({ to, icon: Icon, label, open: sidebarOpen }: { to: string; icon: React.ComponentType<{ size: number }>; label: string; open: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors ${
          isActive ? 'text-accent font-semibold' : 'text-secondary hover:text-accent'
        }`
      }
    >
      <Icon size={16} />
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
      className={`${open ? 'w-[240px]' : 'w-[56px]'} flex flex-col bg-white border-r border-gray-100 transition-all duration-200`}
    >
      {/* Logo */}
      <div className="flex h-[52px] items-center justify-between px-3 shrink-0">
        {open ? (
          <div className="flex items-center gap-2 cursor-pointer" onClick={onToggle}>
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[11px] font-bold text-white">P</div>
            <span className="font-bold text-[13px] text-navy">PYMSMED</span>
          </div>
        ) : (
          <button onClick={onToggle} className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[11px] font-bold text-white mx-auto">
            P
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" open={open} />

        {/* Entornos group */}
        {open ? (
          <div>
            <button
              onClick={() => setEntornosOpen(!entornosOpen)}
              className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-colors ${
                isEntornoActive ? 'text-accent font-semibold' : 'text-secondary hover:text-accent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin size={16} />
                <span>Entornos</span>
              </span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${entornosOpen ? 'rotate-180' : ''}`} />
            </button>
            {entornosOpen && (
              <div className="ml-5 pl-3 border-l border-gray-100 space-y-0.5 mt-0.5">
                {entornoItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                        isActive ? 'text-accent font-semibold' : 'text-gray-400 hover:text-accent'
                      }`
                    }
                  >
                    <item.icon size={13} />
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
        <div className="px-4 py-3 border-t border-gray-100 text-[9px] text-gray-300">
          PYMSMED v0.1 — Prototipo
        </div>
      )}
    </aside>
  )
}
