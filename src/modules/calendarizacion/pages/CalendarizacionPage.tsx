import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { FormField, Input, Select, Textarea } from '@/shared/components/FormField'
import { useAuth } from '@/shared/context/AuthContext'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EventoCalendario, TipoEvento } from '@/shared/types/domain'

const tipoLabels: Record<TipoEvento, string> = {
  visita: 'Visita', actividad: 'Actividad', reunion: 'Reunión',
  capacitacion: 'Capacitación', jornada: 'Jornada', otro: 'Otro',
}
const tipoColors: Record<TipoEvento, string> = {
  visita: '#3b82f6', actividad: '#8b5cf6', reunion: '#6b7280',
  capacitacion: '#f59e0b', jornada: '#10b981', otro: '#ef4444',
}
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  let startPad = firstDay.getDay() - 1
  if (startPad < 0) startPad = 6
  const days: (number | null)[] = Array(startPad).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

export function CalendarizacionPage() {
  const { usuario } = useAuth()
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(4) // mayo = 4 (0-based)
  const [profFilter, setProfFilter] = useState('todos')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newEvt, setNewEvt] = useState({ titulo: '', tipo: 'visita' as TipoEvento, fecha: '', horaInicio: '08:00', horaFin: '12:00', lugar: '', descripcion: '' })

  useEffect(() => {
    setEventos(JSON.parse(localStorage.getItem(STORAGE_KEYS.eventos) || '[]'))
  }, [])

  const profesionales = ['todos', ...Array.from(new Set(eventos.map((e) => e.profesional)))]

  const filteredEventos = profFilter === 'todos' ? eventos : eventos.filter((e) => e.profesional === profFilter)

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filteredEventos.filter((e) => e.fecha === dateStr)
  }

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : []
  const days = getMonthDays(year, month)
  const todayStr = new Date().toISOString().split('T')[0]

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1) } else setMonth(month - 1); setSelectedDay(null) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1) } else setMonth(month + 1); setSelectedDay(null) }

  const handleCreate = () => {
    if (!newEvt.titulo.trim() || !newEvt.fecha) return
    const all: EventoCalendario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.eventos) || '[]')
    const nuevo: EventoCalendario = {
      id: `ev${Date.now()}`, ...newEvt,
      profesional: usuario.nombre,
      color: tipoColors[newEvt.tipo],
    }
    all.push(nuevo)
    localStorage.setItem(STORAGE_KEYS.eventos, JSON.stringify(all))
    setEventos(all)
    setCreateOpen(false)
    setNewEvt({ titulo: '', tipo: 'visita', fecha: '', horaInicio: '08:00', horaFin: '12:00', lugar: '', descripcion: '' })
  }

  return (
    <div>
      <PageHeader
        title="Calendarización"
        subtitle="Agenda de profesionales y actividades"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Calendarización' }]}
        actions={<Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Nuevo evento</Button>}
      />

      {/* Filtro profesional + nav mes */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-1 flex-wrap">
          {profesionales.map((p) => (
            <button key={p} onClick={() => setProfFilter(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                profFilter === p ? 'bg-[var(--pyms-primary)] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}>{p === 'todos' ? 'Todos' : p}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1.5 rounded hover:bg-gray-100"><ChevronLeft size={18} /></button>
          <span className="text-sm font-semibold min-w-[160px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="p-1.5 rounded hover:bg-gray-100"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {Object.entries(tipoLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: tipoColors[key as TipoEvento] }} />
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border bg-white overflow-hidden">
            <div className="grid grid-cols-7">
              {DAYS.map((d) => (
                <div key={d} className="p-2 text-center text-xs font-semibold text-gray-500 border-b bg-gray-50">{d}</div>
              ))}
              {days.map((day, i) => {
                if (day === null) return <div key={i} className="min-h-[80px] border-b border-r bg-gray-50/50" />
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const evts = getEventsForDay(day)
                const isToday = dateStr === todayStr
                const isSelected = selectedDay === day
                return (
                  <button key={i} onClick={() => setSelectedDay(day)}
                    className={`min-h-[80px] border-b border-r p-1 text-left hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-50 ring-2 ring-[var(--pyms-secondary)] ring-inset' : ''}`}>
                    <div className={`text-xs mb-1 ${isToday ? 'w-6 h-6 rounded-full bg-[var(--pyms-primary)] text-white flex items-center justify-center' : 'text-gray-500 pl-1'}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {evts.slice(0, 3).map((e) => (
                        <div key={e.id} className="text-[10px] rounded px-1 py-0.5 text-white truncate" style={{ backgroundColor: e.color }}>
                          {e.titulo}
                        </div>
                      ))}
                      {evts.length > 3 && <div className="text-[10px] text-gray-400 pl-1">+{evts.length - 3} más</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div>
          <Card title={selectedDay ? `${selectedDay} de ${MONTHS[month]}` : 'Seleccione un día'}>
            {selectedDay ? (
              dayEvents.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">Sin eventos este día.</div>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map((e) => (
                    <div key={e.id} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: e.color }} />
                        <span className="text-sm font-medium">{e.titulo}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div className="flex items-center gap-1"><Clock size={10} />{e.horaInicio} - {e.horaFin}</div>
                        <div>{e.profesional}</div>
                        <div>{e.lugar}</div>
                        {e.descripcion && <div className="italic mt-1">{e.descripcion}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">Haga clic en un día para ver los eventos.</div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal crear evento */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nuevo evento" size="md">
        <div className="space-y-4">
          <FormField label="Título" required><Input value={newEvt.titulo} onChange={(e) => setNewEvt((p) => ({ ...p, titulo: e.target.value }))} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tipo"><Select value={newEvt.tipo} onChange={(e) => setNewEvt((p) => ({ ...p, tipo: e.target.value as TipoEvento }))}>{Object.entries(tipoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></FormField>
            <FormField label="Fecha" required><Input type="date" value={newEvt.fecha} onChange={(e) => setNewEvt((p) => ({ ...p, fecha: e.target.value }))} /></FormField>
            <FormField label="Hora inicio"><Input type="time" value={newEvt.horaInicio} onChange={(e) => setNewEvt((p) => ({ ...p, horaInicio: e.target.value }))} /></FormField>
            <FormField label="Hora fin"><Input type="time" value={newEvt.horaFin} onChange={(e) => setNewEvt((p) => ({ ...p, horaFin: e.target.value }))} /></FormField>
          </div>
          <FormField label="Lugar"><Input value={newEvt.lugar} onChange={(e) => setNewEvt((p) => ({ ...p, lugar: e.target.value }))} /></FormField>
          <FormField label="Descripción"><Textarea value={newEvt.descripcion} onChange={(e) => setNewEvt((p) => ({ ...p, descripcion: e.target.value }))} /></FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button icon={<Plus size={16} />} onClick={handleCreate}>Crear evento</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
