import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, Unlock, UserPlus, FileText, ArrowLeft, Activity } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { TrafficLight } from '@/shared/components/TrafficLight'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { Modal } from '@/shared/components/Modal'
import { SolicitudEdicionModal } from '@/modules/entornos/comunitario/components/SolicitudEdicionModal'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type {
  Visita,
  EntornoComunitario,
  Participante,
  PersonaMock,
  Atencion,
  EstadoSemaforo,
} from '@/shared/types/domain'

const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable',
  salud_mental: 'Salud Mental',
  convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad',
  seguridad_alimentaria: 'Seguridad Alimentaria',
  salud_ambiental: 'Salud Ambiental',
  salud_bucal: 'Salud Bucal',
}

interface ParticipanteConPersona extends Participante {
  persona: PersonaMock | null
  atencionesCount: number
  atencionesFinalizadas: number
}

export function VisitaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [visita, setVisita] = useState<Visita | null>(null)
  const [entorno, setEntorno] = useState<EntornoComunitario | null>(null)
  const [participantes, setParticipantes] = useState<ParticipanteConPersona[]>([])
  const [confirmClose, setConfirmClose] = useState(false)
  const [solicitudOpen, setSolicitudOpen] = useState(false)

  const loadData = useCallback(() => {
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const found = visitas.find((v) => v.id === id) ?? null
    setVisita(found)

    if (found) {
      const entornos: EntornoComunitario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.entornos) || '[]')
      setEntorno(entornos.find((e) => e.id === found.entornoId) ?? null)

      const allParticipantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
      const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
      const atenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')

      const visitaParticipantes = allParticipantes
        .filter((p) => p.visitaId === id)
        .map((p) => {
          const persona = personas.find((per) => per.id === p.personaId) ?? null
          const pAtenciones = atenciones.filter((a) => a.participanteId === p.id)
          return {
            ...p,
            persona,
            atencionesCount: pAtenciones.length,
            atencionesFinalizadas: pAtenciones.filter((a) => a.estado === 'finalizada').length,
          }
        })

      setParticipantes(visitaParticipantes)
    }
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  const handleCloseVisita = () => {
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const index = visitas.findIndex((v) => v.id === id)
    if (index === -1) return

    visitas[index] = {
      ...visitas[index],
      estado: 'cerrada',
      actualizadoEn: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.visitas, JSON.stringify(visitas))
    setConfirmClose(false)
    loadData()
  }

  if (!visita) {
    return <div className="p-8 text-center text-gray-500">Visita no encontrada.</div>
  }

  const isClosed = visita.estado === 'cerrada'

  const calcSemaforo = (p: ParticipanteConPersona): EstadoSemaforo => {
    if (p.atencionesCount === 0) return 'rojo'
    if (p.atencionesFinalizadas < p.atencionesCount) return 'amarillo'
    return 'verde'
  }

  const columns: Column<ParticipanteConPersona>[] = [
    {
      key: 'semaforo',
      header: 'Estado',
      render: (p) => <TrafficLight estado={calcSemaforo(p)} />,
    },
    {
      key: 'documento',
      header: 'Documento',
      render: (p) => p.persona ? `${p.persona.tipoDocumento} ${p.persona.numeroDocumento}` : '—',
    },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (p) => p.persona ? `${p.persona.nombres} ${p.persona.apellidos}` : 'Persona no encontrada',
    },
    {
      key: 'edad',
      header: 'Edad',
      render: (p) => p.persona ? `${p.persona.edad} años` : '—',
    },
    {
      key: 'eapb',
      header: 'EAPB',
      render: (p) => p.persona?.eapb ?? '—',
    },
    {
      key: 'atenciones',
      header: 'Atenciones',
      render: (p) => (
        <span className="text-xs">
          {p.atencionesFinalizadas}/{p.atencionesCount}
          {p.atencionesCount > 0 && ' finalizadas'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: '',
      render: (p) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Activity size={14} />}
          onClick={() => navigate(`/visitas/${id}/participantes/${p.personaId}/atencion`)}
          disabled={isClosed}
        >
          Atención
        </Button>
      ),
    },
  ]

  // Stats
  const totalParticipantes = participantes.length
  const sinAtencion = participantes.filter((p) => p.atencionesCount === 0).length
  const atencionParcial = participantes.filter((p) => p.atencionesCount > 0 && p.atencionesFinalizadas < p.atencionesCount).length
  const atencionCompleta = participantes.filter((p) => p.atencionesCount > 0 && p.atencionesFinalizadas === p.atencionesCount).length

  return (
    <div>
      <PageHeader
        title={`Visita — ${visita.fecha}`}
        subtitle={`${dimensionLabels[visita.dimension]} • ${visita.profesionalResponsable}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Entornos Comunitarios', to: '/entornos/comunitario' },
          ...(entorno
            ? [{ label: entorno.nombre, to: `/entornos/comunitario/${entorno.id}` }]
            : []),
          { label: `Visita ${visita.fecha}` },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
              Volver
            </Button>
            {!isClosed && (
              <>
                <Button
                  size="sm"
                  icon={<UserPlus size={14} />}
                  onClick={() => navigate(`/visitas/${id}/agregar-participante`)}
                >
                  Agregar participante
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Lock size={14} />}
                  onClick={() => setConfirmClose(true)}
                >
                  Cerrar visita
                </Button>
              </>
            )}
            {isClosed && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Unlock size={14} />}
                onClick={() => setSolicitudOpen(true)}
              >
                Solicitar reapertura
              </Button>
            )}
          </div>
        }
      />

      {/* Estado banner */}
      {isClosed && (
        <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 flex items-center gap-3">
          <Lock size={18} className="text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Visita cerrada</p>
            <p className="text-xs text-gray-500">No se pueden agregar participantes ni registrar atenciones. Solicite reapertura si es necesario.</p>
          </div>
        </div>
      )}

      {/* Datos de la visita + Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos de la visita" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Fecha</dt>
              <dd className="font-medium">{visita.fecha}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Dimensión</dt>
              <dd className="font-medium">{dimensionLabels[visita.dimension]}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Proyecto</dt>
              <dd className="font-medium">{visita.proyecto}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Profesional</dt>
              <dd className="font-medium">{visita.profesionalResponsable}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Lugar</dt>
              <dd className="font-medium">{visita.lugar}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Estado</dt>
              <dd><StatusBadge status={visita.estado} /></dd>
            </div>
            {visita.observaciones && (
              <div className="col-span-2">
                <dt className="text-gray-500">Observaciones</dt>
                <dd className="font-medium">{visita.observaciones}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card title="Resumen de atención">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{totalParticipantes}</div>
              <div className="text-xs text-gray-500">Participantes</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Sin atención</span>
                </div>
                <span className="text-sm font-semibold">{sinAtencion}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="text-sm text-gray-600">Parcial</span>
                </div>
                <span className="text-sm font-semibold">{atencionParcial}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Completa</span>
                </div>
                <span className="text-sm font-semibold">{atencionCompleta}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Participantes */}
      <Card
        title={`Participantes (${totalParticipantes})`}
        actions={
          !isClosed ? (
            <Button size="sm" icon={<UserPlus size={14} />} onClick={() => navigate(`/visitas/${id}/agregar-participante`)}>
              Agregar
            </Button>
          ) : undefined
        }
      >
        <DataTable
          columns={columns}
          data={participantes}
          emptyMessage="No hay participantes en esta visita."
        />
      </Card>

      {/* Modal confirmar cierre */}
      <Modal open={confirmClose} onClose={() => setConfirmClose(false)} title="Cerrar visita" size="sm">
        <div className="space-y-4">
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Atención:</strong> Al cerrar esta visita no se podrán agregar participantes ni registrar nuevas atenciones.
              Para revertir será necesario solicitar una reapertura.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Participantes:</strong> {totalParticipantes}</p>
            <p><strong>Sin atención:</strong> {sinAtencion}</p>
            {sinAtencion > 0 && (
              <p className="text-red-600 mt-2">Hay participantes sin ninguna atención registrada.</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="secondary" onClick={() => setConfirmClose(false)}>Cancelar</Button>
            <Button variant="danger" icon={<Lock size={16} />} onClick={handleCloseVisita}>Confirmar cierre</Button>
          </div>
        </div>
      </Modal>

      {/* Modal solicitud reapertura */}
      <SolicitudEdicionModal
        open={solicitudOpen}
        onClose={() => setSolicitudOpen(false)}
        entidadTipo="visita"
        entidadId={visita.id}
        entidadNombre={`Visita ${visita.fecha} — ${dimensionLabels[visita.dimension]}`}
      />
    </div>
  )
}
