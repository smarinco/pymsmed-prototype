import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Activity, ClipboardList, ArrowRightLeft, FileSpreadsheet } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { FormField, Input } from '@/shared/components/FormField'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { PersonaMock, Atencion, Visita, Canalizacion, Participante, RespuestaFormulario, FormularioDinamico } from '@/shared/types/domain'

const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable', salud_mental: 'Salud Mental', convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad', seguridad_alimentaria: 'Seg. Alimentaria', salud_ambiental: 'Salud Ambiental', salud_bucal: 'Salud Bucal',
}

interface TimelineItem {
  id: string
  fecha: string
  tipo: 'atencion' | 'visita' | 'canalizacion' | 'formulario'
  titulo: string
  subtitulo: string
  estado: string
  icon: React.ReactNode
  color: string
  link?: string
}

export function HistorialAtencionesPage() {
  const navigate = useNavigate()
  const [searchDoc, setSearchDoc] = useState('')
  const [persona, setPersona] = useState<PersonaMock | null>(null)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = () => {
    if (!searchDoc.trim()) return

    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    const found = personas.find((p) =>
      p.numeroDocumento.includes(searchDoc.trim()) ||
      `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchDoc.toLowerCase())
    ) ?? null

    setPersona(found)
    setSearched(true)

    if (!found) { setTimeline([]); return }

    const items: TimelineItem[] = []

    // Atenciones
    const atenciones: Atencion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.atenciones) || '[]')
    atenciones.filter((a) => a.personaId === found.id).forEach((a) => {
      items.push({
        id: a.id, fecha: a.creadoEn, tipo: 'atencion',
        titulo: `${a.tipoAtencion.replace(/_/g, ' ')} — ${dimensionLabels[a.dimension] || a.dimension}`,
        subtitulo: a.resultado,
        estado: a.estado,
        icon: <Activity size={14} />,
        color: a.estado === 'finalizada' ? 'bg-green-500' : 'bg-yellow-400',
        link: `/visitas/${a.visitaId}/participantes/${found.id}/atencion`,
      })
    })

    // Visitas donde participó
    const participantes: Participante[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantes) || '[]')
    const visitas: Visita[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitas) || '[]')
    const personaParticipaciones = participantes.filter((p) => p.personaId === found.id)
    personaParticipaciones.forEach((part) => {
      const visita = visitas.find((v) => v.id === part.visitaId)
      if (visita) {
        items.push({
          id: `v_${part.id}`, fecha: visita.creadoEn, tipo: 'visita',
          titulo: `Visita: ${dimensionLabels[visita.dimension] || visita.dimension}`,
          subtitulo: `${visita.lugar} — ${visita.profesionalResponsable}`,
          estado: visita.estado,
          icon: <ClipboardList size={14} />,
          color: 'bg-blue-500',
          link: `/visitas/${visita.id}`,
        })
      }
    })

    // Canalizaciones
    const canalizaciones: Canalizacion[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.canalizaciones) || '[]')
    canalizaciones.filter((c) => c.personaId === found.id).forEach((c) => {
      items.push({
        id: c.id, fecha: c.creadoEn, tipo: 'canalizacion',
        titulo: `Canalización: ${c.motivo.replace(/_/g, ' ')}`,
        subtitulo: `${c.descripcion} → ${c.eapbDestino}`,
        estado: c.estado,
        icon: <ArrowRightLeft size={14} />,
        color: c.estado === 'cerrada' || c.estado === 'atendida' ? 'bg-green-500' : c.estado === 'rechazada' ? 'bg-red-500' : 'bg-orange-500',
        link: `/canalizaciones/${c.id}`,
      })
    })

    // Formularios respondidos
    const respuestas: RespuestaFormulario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.respuestasFormulario) || '[]')
    const formularios: FormularioDinamico[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.formularios) || '[]')
    respuestas.filter((r) => r.personaId === found.id).forEach((r) => {
      const form = formularios.find((f) => f.id === r.formularioId)
      items.push({
        id: r.id, fecha: r.creadoEn, tipo: 'formulario',
        titulo: `Formulario: ${form?.nombre || r.formularioId}`,
        subtitulo: r.completado ? 'Completado' : 'Parcial',
        estado: r.completado ? 'finalizada' : 'abierta',
        icon: <FileSpreadsheet size={14} />,
        color: 'bg-purple-500',
        link: `/formularios/${r.formularioId}`,
      })
    })

    // Ordenar por fecha desc
    items.sort((a, b) => b.fecha.localeCompare(a.fecha))
    setTimeline(items)
  }

  return (
    <div>
      <PageHeader
        title="Historial de Atenciones"
        subtitle="Búsqueda global de atenciones por persona"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Historial' }]}
      />

      {/* Buscador */}
      <Card className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input value={searchDoc} onChange={(e) => setSearchDoc(e.target.value)}
              placeholder="Buscar por número de documento o nombre..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          </div>
          <Button icon={<Search size={16} />} onClick={handleSearch}>Buscar</Button>
        </div>
      </Card>

      {searched && !persona && (
        <Card><div className="text-center py-8 text-gray-400 text-sm">No se encontró ninguna persona con ese criterio.</div></Card>
      )}

      {persona && (
        <>
          {/* Datos persona */}
          <Card title="Persona" className="mb-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-[var(--pyms-primary)] text-white flex items-center justify-center text-lg font-bold">
                {persona.nombres[0]}{persona.apellidos[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{persona.nombres} {persona.apellidos}</h3>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>{persona.tipoDocumento} {persona.numeroDocumento}</span>
                  <span>{persona.edad} años</span>
                  <span className="capitalize">{persona.sexo.replace('_', ' ')}</span>
                  <span>{persona.eapb}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--pyms-primary)]">{timeline.length}</div>
                <div className="text-xs text-gray-500">registros</div>
              </div>
            </div>
          </Card>

          {/* Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-lg border bg-white p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{timeline.filter((t) => t.tipo === 'visita').length}</div>
              <div className="text-xs text-gray-500">Visitas</div>
            </div>
            <div className="rounded-lg border bg-white p-3 text-center">
              <div className="text-xl font-bold text-green-600">{timeline.filter((t) => t.tipo === 'atencion').length}</div>
              <div className="text-xs text-gray-500">Atenciones</div>
            </div>
            <div className="rounded-lg border bg-white p-3 text-center">
              <div className="text-xl font-bold text-orange-600">{timeline.filter((t) => t.tipo === 'canalizacion').length}</div>
              <div className="text-xs text-gray-500">Canalizaciones</div>
            </div>
            <div className="rounded-lg border bg-white p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{timeline.filter((t) => t.tipo === 'formulario').length}</div>
              <div className="text-xs text-gray-500">Formularios</div>
            </div>
          </div>

          {/* Timeline */}
          <Card title="Línea de tiempo">
            {timeline.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No hay registros para esta persona.</div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div key={item.id} className="relative flex gap-4 pl-8">
                      <div className={`absolute left-2.5 top-2.5 w-4 h-4 rounded-full ${item.color} flex items-center justify-center text-white`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.tipo === 'atencion' ? 'success' : item.tipo === 'visita' ? 'info' : item.tipo === 'canalizacion' ? 'warning' : 'default'}>
                              {item.tipo === 'atencion' ? 'Atención' : item.tipo === 'visita' ? 'Visita' : item.tipo === 'canalizacion' ? 'Canalización' : 'Formulario'}
                            </Badge>
                            <StatusBadge status={item.estado} />
                          </div>
                          <span className="text-xs text-gray-400">{new Date(item.fecha).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-medium capitalize">{item.titulo}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitulo}</p>
                        {item.link && (
                          <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate(item.link!)}>
                            Ver detalle
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
