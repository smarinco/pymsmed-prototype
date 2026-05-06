import { useState } from 'react'
import { Menu, RefreshCw, ChevronDown } from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import { resetAllData } from '@/shared/storage/seed-manager'

const rolLabels: Record<string, string> = {
  administrador: 'Administrador',
  supervisor: 'Supervisor',
  profesional_social: 'Profesional Social',
  profesional_operativo: 'Profesional Operativo',
  eapb: 'EAPB',
}

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { usuario, setUsuario, usuarios } = useAuth()
  const [selectorOpen, setSelectorOpen] = useState(false)

  const handleReset = () => {
    if (window.confirm('¿Restaurar todos los datos de demostración? Se perderán los cambios realizados.')) {
      resetAllData()
      window.location.reload()
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-[var(--pyms-primary)]">
            PYMSMED — Promoción y Mantenimiento de la Salud
          </h1>
          <p className="text-xs text-gray-500">
            Secretaría de Salud de Medellín • SIISMED
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Reset demo */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          title="Restaurar datos de demostración"
        >
          <RefreshCw size={14} />
          Reset demo
        </button>

        {/* User selector */}
        <div className="relative">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--pyms-primary)] text-white flex items-center justify-center text-xs font-medium">
              {usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{usuario.nombre}</div>
              <div className="text-xs text-gray-500">{rolLabels[usuario.rol]}</div>
            </div>
            <ChevronDown size={14} />
          </button>

          {selectorOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border bg-white shadow-lg z-50">
              <div className="p-3 border-b">
                <p className="text-xs font-semibold text-gray-500 uppercase">Cambiar contexto (mock)</p>
              </div>
              {usuarios.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setUsuario(u); setSelectorOpen(false) }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    u.id === usuario.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--pyms-primary-light)] text-white flex items-center justify-center text-xs font-medium">
                    {u.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{u.nombre}</div>
                    <div className="text-xs text-gray-500">
                      {rolLabels[u.rol]} • {u.contrato.numero} ({u.contrato.estado})
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
