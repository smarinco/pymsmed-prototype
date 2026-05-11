import {
  RefreshCw, Trash2, Database,
  LayoutDashboard, MapPin, Home, GraduationCap, Briefcase, Building2,
  ClipboardList, Users, Leaf, Map, Baby, FileSpreadsheet,
  CalendarDays, ArrowRightLeft, History, Calendar, BarChart3,
  FileText, Settings,
} from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { resetAllData } from '@/shared/storage/seed-manager'
import { useMenuConfig, defaultVisible } from '@/shared/context/MenuConfigContext'

const menuItemsMeta = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'General' },
  { path: '/entornos', label: 'Entornos (grupo)', icon: MapPin, group: 'Entornos' },
  { path: '/entornos/comunitario', label: 'Entorno Comunitario', icon: MapPin, group: 'Entornos' },
  { path: '/hogares', label: 'Entorno Hogar', icon: Home, group: 'Entornos' },
  { path: '/entornos/educativo', label: 'Entorno Educativo', icon: GraduationCap, group: 'Entornos' },
  { path: '/entornos/laboral', label: 'Entorno Laboral', icon: Briefcase, group: 'Entornos' },
  { path: '/entornos/institucional', label: 'Entorno Institucional', icon: Building2, group: 'Entornos' },
  { path: '/visitas', label: 'Visitas', icon: ClipboardList, group: 'Operación' },
  { path: '/participantes', label: 'Participantes', icon: Users, group: 'Operación' },
  { path: '/salud-ambiental', label: 'Salud Ambiental', icon: Leaf, group: 'Módulos' },
  { path: '/mapeo-activos', label: 'Mapeo de Activos', icon: Map, group: 'Módulos' },
  { path: '/salas-amigas', label: 'Salas Amigas', icon: Baby, group: 'Módulos' },
  { path: '/formularios', label: 'Formularios', icon: FileSpreadsheet, group: 'Módulos' },
  { path: '/actividades', label: 'Actividades Colectivas', icon: CalendarDays, group: 'Módulos' },
  { path: '/canalizaciones', label: 'Canalizaciones', icon: ArrowRightLeft, group: 'Módulos' },
  { path: '/historial', label: 'Historial Atenciones', icon: History, group: 'Herramientas' },
  { path: '/calendarizacion', label: 'Calendarización', icon: Calendar, group: 'Herramientas' },
  { path: '/reportes', label: 'Reportes', icon: BarChart3, group: 'Herramientas' },
  { path: '/solicitudes', label: 'Solicitudes', icon: FileText, group: 'Administración' },
  { path: '/administracion', label: 'Administración', icon: Settings, group: 'Administración' },
]

const groups = ['General', 'Entornos', 'Operación', 'Módulos', 'Herramientas', 'Administración']

export function OpcionesPage() {
  const { visibleItems, setItemVisible } = useMenuConfig()

  const handleReset = () => {
    if (window.confirm('¿Restaurar todos los datos de demostración?\nSe perderán todos los cambios realizados durante esta sesión.')) {
      resetAllData()
      window.location.reload()
    }
  }

  const handleClear = () => {
    if (window.confirm('¿Borrar TODOS los datos del navegador?\nEsto dejará la aplicación vacía. Deberá hacer Reset para restaurar los datos demo.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleShowAll = () => {
    for (const key of Object.keys(defaultVisible)) {
      setItemVisible(key, true)
    }
  }

  const handleHideAll = () => {
    for (const key of Object.keys(defaultVisible)) {
      // No ocultar Administración ni Dashboard
      if (key === '/administracion' || key === '/dashboard') continue
      setItemVisible(key, false)
    }
  }

  const visibleCount = Object.values(visibleItems).filter(Boolean).length
  const totalCount = Object.keys(defaultVisible).length

  return (
    <div className="space-y-6">
      {/* Configuración del menú */}
      <Card title="Módulos visibles en el menú">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-secondary">
              Seleccione qué módulos se muestran en el menú lateral. Los cambios se aplican de inmediato.
            </p>
            <div className="flex gap-2 shrink-0 ml-4">
              <Button variant="secondary" size="sm" onClick={handleShowAll}>Mostrar todos</Button>
              <Button variant="secondary" size="sm" onClick={handleHideAll}>Ocultar todos</Button>
            </div>
          </div>

          <div className="text-[13px] text-gray-400">
            {visibleCount} de {totalCount} módulos visibles
          </div>

          <div className="space-y-5">
            {groups.map((group) => {
              const items = menuItemsMeta.filter((m) => m.group === group)
              return (
                <div key={group}>
                  <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{group}</p>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isChecked = visibleItems[item.path] !== false
                      const isProtected = item.path === '/administracion'
                      return (
                        <label
                          key={item.path}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                            isChecked ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 opacity-60'
                          } ${isProtected ? 'cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isProtected}
                            onChange={(e) => setItemVisible(item.path, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/30 accent-[#E8731A]"
                          />
                          <item.icon size={16} className={isChecked ? 'text-accent' : 'text-gray-400'} />
                          <span className={`text-[14px] ${isChecked ? 'text-navy font-medium' : 'text-gray-400'}`}>
                            {item.label}
                          </span>
                          {isProtected && (
                            <span className="text-[11px] text-gray-300 ml-auto">siempre visible</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Datos de demostración */}
      <Card title="Datos de demostración">
        <div className="space-y-4">
          <p className="text-[14px] text-secondary">
            Esta aplicación usa datos de demostración almacenados en el navegador (localStorage).
          </p>

          <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <RefreshCw size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-navy">Restaurar datos demo</p>
                <p className="text-[13px] text-gray-400">Restablece todos los registros a su estado original.</p>
              </div>
            </div>
            <Button icon={<RefreshCw size={16} />} onClick={handleReset}>
              Reset demo
            </Button>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-navy">Borrar todos los datos</p>
                <p className="text-[13px] text-gray-400">Elimina todo el localStorage.</p>
              </div>
            </div>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleClear}>
              Borrar todo
            </Button>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card title="Información">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-gray-400" />
            <span className="text-[14px] text-secondary">Persistencia: localStorage del navegador</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-400 mb-1">Versión</p>
              <p className="font-semibold text-navy">0.1</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-400 mb-1">Stack</p>
              <p className="font-semibold text-navy">React 19 + TypeScript + Vite 8</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-400 mb-1">Módulos</p>
              <p className="font-semibold text-navy">18 módulos funcionales</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-400 mb-1">Backend</p>
              <p className="font-semibold text-navy">No requerido (frontend-only)</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
