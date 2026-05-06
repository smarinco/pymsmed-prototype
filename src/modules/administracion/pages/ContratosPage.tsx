import { useEffect, useState } from 'react'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { Card } from '@/shared/components/Card'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Contrato } from '@/shared/types/domain'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

export function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([])

  useEffect(() => {
    const data: Contrato[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.contratos) || '[]')
    setContratos(data)
  }, [])

  return (
    <div className="space-y-4">
      {contratos.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-400 text-sm">No hay contratos registrados.</div>
        </Card>
      ) : (
        contratos.map((c) => (
          <div key={c.id} className="rounded-lg border bg-white p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-[var(--pyms-primary)]">{c.numero}</span>
                  <StatusBadge status={c.estado} />
                </div>
                <h3 className="text-sm font-medium text-gray-800">{c.proyecto}</h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{formatCurrency(c.presupuesto)}</div>
                <div className="text-xs text-gray-500">Presupuesto</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{c.objeto}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Vigencia: {c.vigenciaInicio} — {c.vigenciaFin}</span>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {c.profesionalesAsignados.map((p) => (
                  <Badge key={p} variant="default">{p}</Badge>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
