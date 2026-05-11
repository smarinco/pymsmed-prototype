import { RefreshCw, Trash2, Database } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { resetAllData } from '@/shared/storage/seed-manager'

export function OpcionesPage() {
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

  return (
    <div className="space-y-6">
      <Card title="Datos de demostración">
        <div className="space-y-4">
          <p className="text-[14px] text-secondary">
            Esta aplicación usa datos de demostración almacenados en el navegador (localStorage).
            Puede restaurar los datos originales en cualquier momento.
          </p>

          <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <RefreshCw size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-navy">Restaurar datos demo</p>
                <p className="text-[13px] text-gray-400">Restablece todos los registros a su estado original (datos semilla).</p>
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
                <p className="text-[13px] text-gray-400">Elimina todo el localStorage. La aplicación quedará vacía.</p>
              </div>
            </div>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleClear}>
              Borrar todo
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Información del prototipo">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-gray-400" />
            <span className="text-[14px] text-secondary">Persistencia: localStorage del navegador</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-400 mb-1">Versión</p>
              <p className="font-semibold text-navy">0.1 — Prototipo</p>
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
