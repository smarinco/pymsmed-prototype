import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { EntornoComunitarioForm } from '../components/EntornoComunitarioForm'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EntornoComunitario, CreateEntornoInput } from '@/shared/types/domain'

export function EntornoComunitarioEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [entorno, setEntorno] = useState<EntornoComunitario | null>(null)

  useEffect(() => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    setEntorno(entornos.find((e) => e.id === id) ?? null)
  }, [id])

  const handleSubmit = (data: CreateEntornoInput) => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const index = entornos.findIndex((e) => e.id === id)
    if (index === -1) return

    entornos[index] = {
      ...entornos[index],
      ...data,
      actualizadoPor: usuario.nombre,
      actualizadoEn: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEYS.entornos, JSON.stringify(entornos))
    navigate(`/entornos/comunitario/${id}`)
  }

  if (!entorno) {
    return <div className="p-8 text-center text-gray-500">Entorno no encontrado.</div>
  }

  return (
    <div>
      <PageHeader
        title={`Editar: ${entorno.nombre}`}
        subtitle={entorno.codigo}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
          { label: entorno.nombre, to: `/entornos/comunitario/${id}` },
          { label: 'Editar' },
        ]}
      />
      <EntornoComunitarioForm initialData={entorno} onSubmit={handleSubmit} isEdit />
    </div>
  )
}
