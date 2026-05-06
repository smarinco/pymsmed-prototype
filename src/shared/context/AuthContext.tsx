import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UsuarioMock } from '@/shared/types/domain'
import { usuariosMock } from '@/shared/mock/seed-data'
import { seedIfEmpty } from '@/shared/storage/seed-manager'

interface AuthContextType {
  usuario: UsuarioMock
  setUsuario: (u: UsuarioMock) => void
  usuarios: UsuarioMock[]
  tienePermiso: (permiso: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioMock>(usuariosMock[0])

  useEffect(() => {
    seedIfEmpty()
  }, [])

  const tienePermiso = (permiso: string) => usuario.permisos.includes(permiso)

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, usuarios: usuariosMock, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
