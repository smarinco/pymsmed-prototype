import { useState } from 'react'
import { RefreshCw, ChevronDown } from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import { resetAllData } from '@/shared/storage/seed-manager'

const rolLabels: Record<string, string> = {
  administrador: 'Administrador',
  supervisor: 'Supervisor',
  profesional_social: 'Profesional Social',
  profesional_operativo: 'Profesional Operativo',
  eapb: 'EAPB',
}

export function Header() {
  const { usuario, setUsuario, usuarios } = useAuth()
  const [selectorOpen, setSelectorOpen] = useState(false)

  const handleReset = () => {
    if (window.confirm('¿Restaurar todos los datos de demostración? Se perderán los cambios realizados.')) {
      resetAllData()
      window.location.reload()
    }
  }

  return (
    <header className="flex h-[52px] items-center justify-between border-b border-gray-100 bg-white px-6 shrink-0">
      <div>
        <p className="text-[13px] text-gray-400">
          Secretaría de Salud de Medellín · SIISMED
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Reset demo */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1 text-[13px] text-gray-500 hover:bg-gray-50 transition-colors"
          title="Restaurar datos de demostración"
        >
          <RefreshCw size={12} />
          Reset
        </button>

        {/* User selector */}
        <div className="relative">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-[12px] font-semibold">
              {usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="text-left">
              <div className="text-[14px] font-semibold text-navy">{usuario.nombre}</div>
              <div className="text-[12px] text-gray-400">{rolLabels[usuario.rol]}</div>
            </div>
            <ChevronDown size={12} className="text-gray-400" />
          </button>

          {selectorOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">Cambiar contexto (mock)</p>
              </div>
              {usuarios.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setUsuario(u); setSelectorOpen(false) }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50/30 transition-colors ${
                    u.id === usuario.id ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-navy/80 text-white flex items-center justify-center text-[12px] font-semibold">
                    {u.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-navy">{u.nombre}</div>
                    <div className="text-[12px] text-gray-400">
                      {rolLabels[u.rol]} · {u.contrato.numero}
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
