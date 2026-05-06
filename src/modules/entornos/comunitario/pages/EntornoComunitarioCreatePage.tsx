import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { EntornoComunitarioForm } from '../components/EntornoComunitarioForm'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EntornoComunitario, CreateEntornoInput } from '@/shared/types/domain'

export function EntornoComunitarioCreatePage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const handleSubmit = (data: CreateEntornoInput) => {
    const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
    const nextNum = entornos.length + 1
    const now = new Date().toISOString()

    const nuevo: EntornoComunitario = {
      id: `ec${Date.now()}`,
      codigo: `EC-${String(nextNum).padStart(3, '0')}`,
      ...data,
      estado: 'activo',
      creadoPor: usuario.nombre,
      creadoEn: now,
      actualizadoPor: usuario.nombre,
      actualizadoEn: now,
    }

    entornos.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.entornos, JSON.stringify(entornos))
    navigate(`/entornos/comunitario/${nuevo.id}`)
  }

  return (
    <div>
      <PageHeader
        title="Nuevo Entorno Comunitario"
        subtitle="Registrar un nuevo punto o espacio comunitario"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
          { label: 'Nuevo' },
        ]}
      />
      <EntornoComunitarioForm onSubmit={handleSubmit} />
    </div>
  )
}
