import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit, UserPlus, ClipboardList, Plus, ArrowLeft, Trash2 } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Badge } from '@/shared/components/Badge'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import { useAuth } from '@/shared/context/AuthContext'
import type { Hogar, IntegranteHogar, PersonaMock, Caracterizacion, SeguimientoCaracterizacion } from '@/shared/types/domain'

const tipoViviendaLabels: Record<string, string> = {
  casa: 'Casa', apartamento: 'Apartamento', habitacion: 'Habitación', inquilinato: 'Inquilinato', otro: 'Otro',
}
const tenenciaLabels: Record<string, string> = {
  propia: 'Propia', arrendada: 'Arrendada', familiar: 'Familiar', invasion: 'Invasión', otra: 'Otra',
}
const parentescoLabels: Record<string, string> = {
  jefe_hogar: 'Jefe de hogar', conyuge: 'Cónyuge', hijo: 'Hijo/a', padre_madre: 'Padre/Madre',
  hermano: 'Hermano/a', abuelo: 'Abuelo/a', nieto: 'Nieto/a', otro_familiar: 'Otro familiar', no_familiar: 'No familiar',
}

interface IntegranteConPersona extends IntegranteHogar {
  persona: PersonaMock | null
}

export function HogarDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [hogar, setHogar] = useState<Hogar | null>(null)
  const [integrantes, setIntegrantes] = useState<IntegranteConPersona[]>([])
  const [caracterizaciones, setCaracterizaciones] = useState<Caracterizacion[]>([])
  const [seguimientos, setSeguimientos] = useState<SeguimientoCaracterizacion[]>([])

  const loadData = useCallback(() => {
    const hogares: Hogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.hogares) || '[]')
    setHogar(hogares.find((h) => h.id === id) ?? null)

    const allIntegrantes: IntegranteHogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.integrantes) || '[]')
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    setIntegrantes(
      allIntegrantes.filter((i) => i.hogarId === id).map((i) => ({
        ...i,
        persona: personas.find((p) => p.id === i.personaId) ?? null,
      }))
    )

    const allCar: Caracterizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.caracterizaciones) || '[]')
    setCaracterizaciones(allCar.filter((c) => c.hogarId === id))

    const allSeg: SeguimientoCaracterizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.seguimientos) || '[]')
    setSeguimientos(allSeg.filter((s) => s.hogarId === id))
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  const handleRemoveIntegrante = (integranteId: string) => {
    if (!window.confirm('¿Eliminar este integrante del hogar?')) return
    const all: IntegranteHogar[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.integrantes) || '[]')
    localStorage.setItem(STORAGE_KEYS.integrantes, JSON.stringify(all.filter((i) => i.id !== integranteId)))
    loadData()
  }

  if (!hogar) return <div className="p-8 text-center text-gray-500">Hogar no encontrado.</div>

  const integranteColumns: Column<IntegranteConPersona>[] = [
    {
      key: 'nombre', header: 'Nombre',
      render: (i) => (
        <div>
          <span className="font-medium">{i.persona ? `${i.persona.nombres} ${i.persona.apellidos}` : 'Desconocido'}</span>
          {i.esJefeHogar && <Badge variant="info" >Jefe</Badge>}
        </div>
      ),
    },
    { key: 'documento', header: 'Documento', render: (i) => i.persona ? `${i.persona.tipoDocumento} ${i.persona.numeroDocumento}` : '—' },
    { key: 'edad', header: 'Edad', render: (i) => i.persona ? `${i.persona.edad} años` : '—' },
    { key: 'parentesco', header: 'Parentesco', render: (i) => parentescoLabels[i.parentesco] || i.parentesco },
    {
      key: 'acciones', header: '',
      render: (i) => (
        <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => handleRemoveIntegrante(i.id)}>
          Quitar
        </Button>
      ),
    },
  ]

  const lastCar = caracterizaciones[caracterizaciones.length - 1]
  const riesgosTotal = lastCar?.secciones.reduce((sum, s) => sum + s.riesgos.length, 0) ?? 0
  const seccionesCompletadas = lastCar?.secciones.filter((s) => s.completada).length ?? 0
  const seccionesTotal = lastCar?.secciones.length ?? 0

  return (
    <div>
      <PageHeader
        title={`Hogar ${hogar.codigo}`}
        subtitle={hogar.direccion}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entorno Hogar', to: '/hogares' },
          { label: hogar.codigo },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/hogares/${id}/editar`)}>Editar</Button>
          </div>
        }
      />

      {/* Info + Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos del hogar" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="text-gray-500">Dirección</dt><dd className="font-medium">{hogar.direccion}</dd></div>
            <div><dt className="text-gray-500">Comuna</dt><dd className="font-medium">{hogar.comuna}</dd></div>
            <div><dt className="text-gray-500">Barrio</dt><dd className="font-medium">{hogar.barrio}</dd></div>
            <div><dt className="text-gray-500">Estrato</dt><dd className="font-medium">{hogar.estrato}</dd></div>
            <div><dt className="text-gray-500">Tipo vivienda</dt><dd className="font-medium">{tipoViviendaLabels[hogar.tipoVivienda]}</dd></div>
            <div><dt className="text-gray-500">Tenencia</dt><dd className="font-medium">{tenenciaLabels[hogar.tenencia]}</dd></div>
            <div><dt className="text-gray-500">Teléfono</dt><dd className="font-medium">{hogar.telefono}</dd></div>
            <div><dt className="text-gray-500">Estado</dt><dd><StatusBadge status={hogar.estado} /></dd></div>
            {hogar.observaciones && (
              <div className="col-span-2"><dt className="text-gray-500">Observaciones</dt><dd className="font-medium">{hogar.observaciones}</dd></div>
            )}
          </dl>
        </Card>

        <Card title="Resumen">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{integrantes.length}</div>
              <div className="text-xs text-gray-500">Integrantes</div>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Caracterización</span>
                {lastCar
                  ? <Badge variant={lastCar.estado === 'completada' ? 'success' : 'warning'}>{seccionesCompletadas}/{seccionesTotal} secciones</Badge>
                  : <Badge variant="default">Sin iniciar</Badge>}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Riesgos</span>
                <span className="font-semibold">{riesgosTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Seguimientos</span>
                <span className="font-semibold">{seguimientos.length}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Integrantes */}
      <Card
        title={`Integrantes (${integrantes.length})`}
        actions={<Button size="sm" icon={<UserPlus size={14} />} onClick={() => navigate(`/hogares/${id}/agregar-integrante`)}>Agregar</Button>}
        className="mb-6"
      >
        <DataTable columns={integranteColumns} data={integrantes} emptyMessage="No hay integrantes registrados." />
      </Card>

      {/* Caracterizaciones */}
      <Card
        title={`Caracterizaciones (${caracterizaciones.length})`}
        actions={
          <Button size="sm" icon={<Plus size={14} />} onClick={() => navigate(`/hogares/${id}/caracterizacion/nueva`)}>
            {caracterizaciones.length === 0 ? 'Iniciar' : 'Nueva'}
          </Button>
        }
        className="mb-6"
      >
        {caracterizaciones.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">No hay caracterizaciones. Inicie una para evaluar las dimensiones del hogar.</div>
        ) : (
          <div className="space-y-3">
            {caracterizaciones.map((c) => {
              const completadas = c.secciones.filter((s) => s.completada).length
              const total = c.secciones.length
              const riesgos = c.secciones.reduce((sum, s) => sum + s.riesgos.length, 0)
              return (
                <div key={c.id} className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{c.fecha}</span>
                        <Badge variant={c.estado === 'completada' ? 'success' : 'warning'}>
                          {c.estado === 'completada' ? 'Completada' : 'En progreso'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {c.profesional} • {completadas}/{total} secciones • {riesgos} riesgo(s)
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" icon={<ClipboardList size={14} />} onClick={() => navigate(`/hogares/${id}/caracterizacion/${c.id}`)}>
                      {c.estado === 'completada' ? 'Ver' : 'Continuar'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Seguimientos */}
      {seguimientos.length > 0 && (
        <Card title={`Seguimientos (${seguimientos.length})`}>
          <div className="space-y-3">
            {seguimientos.map((s) => (
              <div key={s.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{s.fecha}</span>
                  <span className="text-xs text-gray-500">{s.profesional}</span>
                </div>
                <p className="text-sm text-gray-700">{s.observaciones}</p>
                {s.riesgosActualizados.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {s.riesgosActualizados.map((r, i) => (
                      <div key={i} className="text-xs text-gray-500">
                        Riesgo actualizado a <Badge variant={r.nuevoNivel === 'bajo' ? 'success' : r.nuevoNivel === 'medio' ? 'warning' : 'danger'}>{r.nuevoNivel}</Badge> — {r.nota}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
