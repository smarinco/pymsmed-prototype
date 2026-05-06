import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { FormField, Textarea } from '@/shared/components/FormField'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EntornoComunitario } from '@/shared/types/domain'

export function EntornoComunitarioInactivatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [entorno, setEntorno] = useState<EntornoComunitario | null>(null)
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    setEntorno(entornos.find((e) => e.id === id) ?? null)
  }, [id])

  const handleInactivar = () => {
    if (!motivo.trim()) {
      setError('Debe ingresar una justificación para inactivar el entorno.')
      return
    }

    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const index = entornos.findIndex((e) => e.id === id)
    if (index === -1) return

    entornos[index] = {
      ...entornos[index],
      estado: 'inactivo',
      motivoInactivacion: motivo,
      actualizadoPor: usuario.nombre,
      actualizadoEn: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEYS.entornos, JSON.stringify(entornos))
    navigate(`/entornos/comunitario/${id}`)
  }

  if (!entorno) {
    return <div className="p-8 text-center text-gray-500">Entorno no encontrado.</div>
  }

  if (entorno.estado === 'inactivo') {
    return (
      <div className="p-8 text-center text-gray-500">
        Este entorno ya se encuentra inactivo.
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate(`/entornos/comunitario/${id}`)}>
            Volver a la ficha
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Inactivar Entorno Comunitario"
        subtitle={`${entorno.codigo} — ${entorno.nombre}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
          { label: entorno.nombre, to: `/entornos/comunitario/${id}` },
          { label: 'Inactivar' },
        ]}
      />

      <Card title="Confirmar inactivación">
        <div className="space-y-5">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">
              <strong>Atención:</strong> Al inactivar este entorno, no se podrán crear nuevas visitas asociadas.
              Los registros existentes se mantendrán para consulta.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Estado actual:</span>
            <StatusBadge status={entorno.estado} />
          </div>

          <FormField label="Justificación de inactivación" required error={error}>
            <Textarea
              value={motivo}
              onChange={(e) => { setMotivo(e.target.value); setError('') }}
              placeholder="Describa el motivo por el cual se inactiva este entorno..."
              rows={4}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="danger" icon={<XCircle size={16} />} onClick={handleInactivar}>
              Confirmar inactivación
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
