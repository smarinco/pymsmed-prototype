import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, FileSpreadsheet } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { FormularioDinamico, RespuestaFormulario, PersonaMock } from '@/shared/types/domain'

const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable', salud_mental: 'Salud Mental', convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad', seguridad_alimentaria: 'Seg. Alimentaria', salud_ambiental: 'Salud Ambiental', salud_bucal: 'Salud Bucal',
}
const aplicaLabels: Record<string, string> = {
  ninos: 'Niños', adolescentes: 'Adolescentes', adultos: 'Adultos',
  gestantes: 'Gestantes', adulto_mayor: 'Adulto mayor', todos: 'Todos',
}
const tipoLabels: Record<string, string> = {
  text: 'Texto', number: 'Número', select: 'Selección', checkbox: 'Casillas', radio: 'Opción única', textarea: 'Texto largo', date: 'Fecha',
}

export function FormularioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormularioDinamico | null>(null)
  const [respuestas, setRespuestas] = useState<(RespuestaFormulario & { personaNombre: string })[]>([])

  useEffect(() => {
    const formularios: FormularioDinamico[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.formularios) || '[]')
    setForm(formularios.find((f) => f.id === id) ?? null)

    const allResp: RespuestaFormulario[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.respuestasFormulario) || '[]')
    const personas: PersonaMock[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.personas) || '[]')
    setRespuestas(
      allResp.filter((r) => r.formularioId === id).map((r) => {
        const p = personas.find((per) => per.id === r.personaId)
        return { ...r, personaNombre: p ? `${p.nombres} ${p.apellidos}` : 'Desconocido' }
      })
    )
  }, [id])

  if (!form) return <div className="p-8 text-center text-gray-500">Formulario no encontrado.</div>

  const totalCampos = form.secciones.reduce((s, sec) => s + sec.campos.length, 0)

  return (
    <div>
      <PageHeader
        title={form.nombre}
        subtitle={`${form.codigo} — v${form.version}`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Formularios', to: '/formularios' }, { label: form.nombre }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/formularios')}>Volver</Button>
            <Button size="sm" icon={<Play size={14} />} onClick={() => navigate(`/formularios/${id}/ejecutar`)}>Ejecutar formulario</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Información" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="col-span-2"><dt className="text-gray-500">Descripción</dt><dd className="font-medium">{form.descripcion}</dd></div>
            <div><dt className="text-gray-500">Dimensión</dt><dd><Badge variant="info">{dimensionLabels[form.dimension]}</Badge></dd></div>
            <div><dt className="text-gray-500">Población</dt><dd className="flex gap-1 flex-wrap">{form.aplicaA.map((a) => <Badge key={a} variant="default">{aplicaLabels[a]}</Badge>)}</dd></div>
            <div><dt className="text-gray-500">Secciones</dt><dd className="font-medium">{form.secciones.length}</dd></div>
            <div><dt className="text-gray-500">Campos totales</dt><dd className="font-medium">{totalCampos}</dd></div>
          </dl>
        </Card>

        <Card title="Estadísticas">
          <div className="space-y-3 text-center">
            <div><div className="text-3xl font-bold text-[var(--pyms-primary)]">{respuestas.length}</div><div className="text-xs text-gray-500">Respuestas registradas</div></div>
            <div><div className="text-lg font-bold">{respuestas.filter((r) => r.completado).length}</div><div className="text-xs text-gray-500">Completadas</div></div>
          </div>
        </Card>
      </div>

      {/* Estructura del formulario */}
      <Card title="Estructura del formulario" className="mb-6">
        <div className="space-y-4">
          {form.secciones.map((sec, i) => (
            <div key={sec.id} className="rounded-lg border p-4">
              <h4 className="text-sm font-semibold mb-1">Sección {i + 1}: {sec.titulo}</h4>
              {sec.descripcion && <p className="text-xs text-gray-500 mb-3">{sec.descripcion}</p>}
              <div className="space-y-1">
                {sec.campos.map((campo) => (
                  <div key={campo.id} className="flex items-center gap-3 text-xs py-1 border-b border-gray-100 last:border-0">
                    <Badge variant="default">{tipoLabels[campo.tipo]}</Badge>
                    <span className="font-medium">{campo.label}</span>
                    {campo.requerido && <span className="text-red-500">*</span>}
                    {campo.opciones && <span className="text-gray-400">({campo.opciones.length} opciones)</span>}
                    {campo.ayuda && <span className="text-gray-400 italic">— {campo.ayuda}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Respuestas registradas */}
      {respuestas.length > 0 && (
        <Card title={`Respuestas (${respuestas.length})`}>
          <div className="space-y-3">
            {respuestas.map((r) => (
              <div key={r.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{r.personaNombre}</span>
                    <Badge variant={r.completado ? 'success' : 'warning'}>{r.completado ? 'Completado' : 'Parcial'}</Badge>
                  </div>
                  <span className="text-xs text-gray-500">{r.fecha}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(r.respuestas).slice(0, 6).map(([key, val]) => (
                    <span key={key} className="text-xs bg-gray-100 rounded px-2 py-1">
                      {key}: <strong>{String(val)}</strong>
                    </span>
                  ))}
                  {Object.keys(r.respuestas).length > 6 && <span className="text-xs text-gray-400">+{Object.keys(r.respuestas).length - 6} más</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
