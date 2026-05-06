import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { TrafficLight } from '@/shared/components/TrafficLight'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { Participante, PersonaMock, Visita, Atencion, EstadoSemaforo } from '@/shared/types/domain'

interface ParticipanteEnriquecido {
  participanteId: string
  visitaId: string
  personaId: string
  nombres: string
  apellidos: string
  tipoDocumento: string
  numeroDocumento: string
  edad: number
  eapb: string
  visitaFecha: string
  visitaLugar: string
  visitaEstado: string
  semaforo: EstadoSemaforo
  atencionesTotal: number
  atencionesFinalizadas: number
}

export function ParticipanteListPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<ParticipanteEnriquecido[]>([])
  const [filtered, setFiltered] = useState<ParticipanteEnriquecido[]>([])

  useEffect(() => {
    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const atenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')

    const enriched: ParticipanteEnriquecido[] = participantes.map((p) => {
      const persona = personas.find((per) => per.id === p.personaId)
      const visita = visitas.find((v) => v.id === p.visitaId)
      const pAtenciones = atenciones.filter((a) => a.participanteId === p.id)

      let semaforo: EstadoSemaforo = 'rojo'
      if (pAtenciones.length > 0) {
        semaforo = pAtenciones.every((a) => a.estado === 'finalizada') ? 'verde' : 'amarillo'
      }

      return {
        participanteId: p.id,
        visitaId: p.visitaId,
        personaId: p.personaId,
        nombres: persona?.nombres ?? 'Desconocido',
        apellidos: persona?.apellidos ?? '',
        tipoDocumento: persona?.tipoDocumento ?? '',
        numeroDocumento: persona?.numeroDocumento ?? '',
        edad: persona?.edad ?? 0,
        eapb: persona?.eapb ?? '—',
        visitaFecha: visita?.fecha ?? '—',
        visitaLugar: visita?.lugar ?? '—',
        visitaEstado: visita?.estado ?? '—',
        semaforo,
        atencionesTotal: pAtenciones.length,
        atencionesFinalizadas: pAtenciones.filter((a) => a.estado === 'finalizada').length,
      }
    })

    setData(enriched)
    setFiltered(enriched)
  }, [])

  const handleSearch = (query: string) => {
    const q = query.toLowerCase()
    setFiltered(
      data.filter(
        (p) =>
          `${p.nombres} ${p.apellidos}`.toLowerCase().includes(q) ||
          p.numeroDocumento.includes(q) ||
          p.eapb.toLowerCase().includes(q) ||
          p.visitaLugar.toLowerCase().includes(q),
      ),
    )
  }

  const columns: Column<ParticipanteEnriquecido>[] = [
    {
      key: 'semaforo',
      header: 'Estado',
      render: (p) => <TrafficLight estado={p.semaforo} showLabel={false} />,
    },
    {
      key: 'nombre',
      header: 'Nombre',
      render: (p) => <span className="font-medium">{p.nombres} {p.apellidos}</span>,
    },
    {
      key: 'documento',
      header: 'Documento',
      render: (p) => <span className="text-xs">{p.tipoDocumento} {p.numeroDocumento}</span>,
    },
    { key: 'edad', header: 'Edad', render: (p) => `${p.edad} años` },
    { key: 'eapb', header: 'EAPB', render: (p) => p.eapb },
    {
      key: 'visita',
      header: 'Visita',
      render: (p) => (
        <button
          onClick={() => navigate(`/visitas/${p.visitaId}`)}
          className="text-[var(--pyms-secondary)] hover:underline text-xs text-left"
        >
          {p.visitaFecha} — {p.visitaLugar}
        </button>
      ),
    },
    {
      key: 'atenciones',
      header: 'Atenciones',
      render: (p) => (
        <span className="text-xs">{p.atencionesFinalizadas}/{p.atencionesTotal}</span>
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
          onClick={() => navigate(`/visitas/${p.visitaId}/participantes/${p.personaId}/atencion`)}
        >
          Atención
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Participantes"
        subtitle="Listado general de participantes en todas las visitas"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Participantes' },
        ]}
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No hay participantes registrados."
        searchPlaceholder="Buscar por nombre, documento, EAPB o lugar..."
        onSearch={handleSearch}
      />
    </div>
  )
}
