import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface MenuConfigContextType {
  visibleItems: Record<string, boolean>
  setItemVisible: (path: string, visible: boolean) => void
  isVisible: (path: string) => boolean
}

const STORAGE_KEY = 'pyms_menu_config'

const defaultVisible: Record<string, boolean> = {
  '/dashboard': true,
  '/entornos': true,
  '/entornos/comunitario': true,
  '/hogares': true,
  '/entornos/educativo': true,
  '/entornos/laboral': true,
  '/entornos/institucional': true,
  '/visitas': true,
  '/participantes': true,
  '/salud-ambiental': true,
  '/mapeo-activos': true,
  '/salas-amigas': true,
  '/formularios': true,
  '/actividades': true,
  '/canalizaciones': true,
  '/historial': true,
  '/calendarizacion': true,
  '/reportes': true,
  '/solicitudes': true,
  '/administracion': true,
}

const MenuConfigContext = createContext<MenuConfigContextType | null>(null)

export function MenuConfigProvider({ children }: { children: ReactNode }) {
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultVisible, ...JSON.parse(stored) } : defaultVisible
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleItems))
  }, [visibleItems])

  const setItemVisible = (path: string, visible: boolean) => {
    setVisibleItems((prev) => ({ ...prev, [path]: visible }))
  }

  const isVisible = (path: string) => visibleItems[path] !== false

  return (
    <MenuConfigContext.Provider value={{ visibleItems, setItemVisible, isVisible }}>
      {children}
    </MenuConfigContext.Provider>
  )
}

export function useMenuConfig(): MenuConfigContextType {
  const ctx = useContext(MenuConfigContext)
  if (!ctx) throw new Error('useMenuConfig debe usarse dentro de MenuConfigProvider')
  return ctx
}

export { defaultVisible }
