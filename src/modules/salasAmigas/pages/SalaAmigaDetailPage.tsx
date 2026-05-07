import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { EmpresaSalaAmiga, SocializacionNorma, SeguimientoSalaAmiga, EstadoEmpresaSala } from '@/shared/types/domain'

const estadoConfig: Record<EstadoEmpresaSala, { label: string; variant: 'default' | 'success' | 'info' | 'warning' | 'danger' }> = {
  identificada: { label: 'Identificada', variant: 'default' },
  socializada: { label: 'Socializada', variant: 'info' },
  en_implementacion: { label: 'En implementación', variant: 'warning' },
  certificada: { label: 'Certificada', variant: 'success' },
  no_aplica: { label: 'No aplica', variant: 'default' },
}

const tipoVisitaLabels: Record<string, string> = {
  verificacion: 'Verificación', asesoria: 'Asesoría', seguimiento: 'Seguimiento',
}

export function SalaAmigaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState<EmpresaSalaAmiga | null>(null)
  const [socializaciones, setSocializaciones] = useState<SocializacionNorma[]>([])
  const [seguimientos, setSeguimientos] = useState<SeguimientoSalaAmiga[]>([])

  useEffect(() => {
    const empresas: EmpresaSalaAmiga[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.empresasSala) || '[]')
    setEmpresa(empresas.find((e) => e.id === id) ?? null)
    const socs: SocializacionNorma[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.socializaciones) || '[]')
    setSocializaciones(socs.filter((s) => s.empresaId === id))
    const segs: SeguimientoSalaAmiga[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.seguimientosSala) || '[]')
    setSeguimientos(segs.filter((s) => s.empresaId === id))
  }, [id])

  if (!empresa) return <div className="p-8 text-center text-gray-500">Empresa no encontrada.</div>

  const eCfg = estadoConfig[empresa.estado]

  // Progreso visual
  const steps: { key: EstadoEmpresaSala; label: string }[] = [
    { key: 'identificada', label: 'Identificada' },
    { key: 'socializada', label: 'Socializada' },
    { key: 'en_implementacion', label: 'Implementación' },
    { key: 'certificada', label: 'Certificada' },
  ]
  const currentStep = steps.findIndex((s) => s.key === empresa.estado)

  return (
    <div>
      <PageHeader
        title={empresa.nombreEmpresa}
        subtitle={`${empresa.codigo} — Sala Amiga`}
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Salas Amigas', to: '/salas-amigas' }, { label: empresa.nombreEmpresa }]}
        actions={<Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/salas-amigas')}>Volver</Button>}
      />

      {/* Progreso */}
      {empresa.estado !== 'no_aplica' && (
        <div className="mb-6 rounded-lg border bg-white p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Progreso</h3>
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i <= currentStep ? 'bg-[var(--pyms-accent)] text-white' : 'bg-gray-200 text-gray-500'
                }`}>{i + 1}</div>
                <span className={`text-xs ${i <= currentStep ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-[var(--pyms-accent)]' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Datos de la empresa" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="text-gray-500">NIT</dt><dd className="font-medium">{empresa.nit}</dd></div>
            <div><dt className="text-gray-500">Sector</dt><dd className="font-medium">{empresa.sectorEconomico}</dd></div>
            <div><dt className="text-gray-500">Comuna</dt><dd className="font-medium">{empresa.comuna}</dd></div>
            <div><dt className="text-gray-500">Barrio</dt><dd className="font-medium">{empresa.barrio}</dd></div>
            <div><dt className="text-gray-500">Dirección</dt><dd className="font-medium">{empresa.direccion}</dd></div>
            <div><dt className="text-gray-500">Contacto</dt><dd className="font-medium">{empresa.contactoNombre} — {empresa.contactoCargo}</dd></div>
            <div><dt className="text-gray-500">Teléfono</dt><dd className="font-medium">{empresa.contactoTelefono}</dd></div>
            <div><dt className="text-gray-500">Trabajadores</dt><dd className="font-medium">{empresa.numTrabajadores}</dd></div>
            <div><dt className="text-gray-500">Mujeres en edad fértil</dt><dd className="font-medium">{empresa.numMujeresEdadFertil}</dd></div>
            <div><dt className="text-gray-500">Tiene sala amiga</dt><dd>{empresa.tieneSalaAmiga ? <Badge variant="success">Sí</Badge> : <Badge variant="default">No</Badge>}</dd></div>
            {empresa.observaciones && (
              <div className="col-span-2"><dt className="text-gray-500">Observaciones</dt><dd>{empresa.observaciones}</dd></div>
            )}
          </dl>
        </Card>

        <Card title="Estado">
          <div className="flex flex-col items-center py-4 gap-3">
            <Badge variant={eCfg.variant}>{eCfg.label}</Badge>
            <div className="text-center text-sm text-gray-500">
              {socializaciones.length} socialización(es)<br />
              {seguimientos.length} seguimiento(s)
            </div>
          </div>
        </Card>
      </div>

      {/* Socializaciones */}
      <Card title={`Socializaciones de norma (${socializaciones.length})`} className="mb-6">
        {socializaciones.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">Sin socializaciones registradas.</div>
        ) : (
          <div className="space-y-3">
            {socializaciones.map((s) => (
              <div key={s.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{s.fecha}</span>
                  <span className="text-xs text-gray-500">{s.profesional} • {s.asistentes} asistentes</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {s.temasTratados.map((t, i) => <Badge key={i} variant="info">{t}</Badge>)}
                </div>
                <p className="text-sm text-gray-700"><strong>Compromisos:</strong> {s.compromisos}</p>
                {s.observaciones && <p className="text-xs text-gray-500 mt-1">{s.observaciones}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Seguimientos */}
      <Card title={`Seguimientos (${seguimientos.length})`}>
        {seguimientos.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">Sin seguimientos registrados.</div>
        ) : (
          <div className="space-y-3">
            {seguimientos.map((s) => (
              <div key={s.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{s.fecha}</span>
                    <Badge variant="info">{tipoVisitaLabels[s.tipoVisita]}</Badge>
                    {s.cumpleRequisitos ? <Badge variant="success">Cumple</Badge> : <Badge variant="danger">No cumple</Badge>}
                  </div>
                  <span className="text-xs text-gray-500">{s.profesional}</span>
                </div>
                <p className="text-sm text-gray-700 mb-1"><strong>Hallazgos:</strong> {s.hallazgos}</p>
                <p className="text-sm text-gray-700"><strong>Recomendaciones:</strong> {s.recomendaciones}</p>
                {s.proximaVisita && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar size={12} /> Próxima visita: {s.proximaVisita}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
