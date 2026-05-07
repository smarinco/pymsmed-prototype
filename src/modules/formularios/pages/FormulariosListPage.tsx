import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Play, FileSpreadsheet } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { STORAGE_KEYS } from '@/shared/storage/seed-manager'
import type { FormularioDinamico, RespuestaFormulario } from '@/shared/types/domain'

const dimensionLabels: Record<string, string> = {
  vida_saludable: 'Vida Saludable', salud_mental: 'Salud Mental', convivencia_social: 'Convivencia Social',
  sexualidad: 'Sexualidad', seguridad_alimentaria: 'Seg. Alimentaria', salud_ambiental: 'Salud Ambiental', salud_bucal: 'Salud Bucal',
}
const aplicaLabels: Record<string, string> = {
  ninos: 'Niños', adolescentes: 'Adolescentes', adultos: 'Adultos',
  gestantes: 'Gestantes', adulto_mayor: 'Adulto mayor', todos: 'Todos',
}

export function FormulariosListPage() {
  const navigate = useNavigate()
  const [formularios, setFormularios] = useState<FormularioDinamico[]>([])
  const [respuestas, setRespuestas] = useState<RespuestaFormulario[]>([])

  useEffect(() => {
    setFormularios(JSON.parse(localStorage.getItem(STORAGE_KEYS.formularios) || '[]'))
    setRespuestas(JSON.parse(localStorage.getItem(STORAGE_KEYS.respuestasFormulario) || '[]'))
  }, [])

  const getRespCount = (fId: string) => respuestas.filter((r) => r.formularioId === fId).length

  const columns: Column<FormularioDinamico>[] = [
    { key: 'codigo', header: 'Código', render: (f) => <span className="font-mono text-xs">{f.codigo}</span> },
    {
      key: 'nombre', header: 'Formulario',
      render: (f) => (
        <button onClick={() => navigate(`/formularios/${f.id}`)} className="text-[var(--pyms-secondary)] hover:underline font-medium text-left">
          {f.nombre}
        </button>
      ),
    },
    { key: 'version', header: 'Versión', render: (f) => <span className="text-xs">v{f.version}</span> },
    { key: 'dimension', header: 'Dimensión', render: (f) => <Badge variant="info">{dimensionLabels[f.dimension]}</Badge> },
    {
      key: 'aplica', header: 'Población',
      render: (f) => <div className="flex gap-1 flex-wrap">{f.aplicaA.map((a) => <Badge key={a} variant="default">{aplicaLabels[a]}</Badge>)}</div>,
    },
    {
      key: 'campos', header: 'Campos',
      render: (f) => f.secciones.reduce((s, sec) => s + sec.campos.length, 0),
    },
    { key: 'respuestas', header: 'Respuestas', render: (f) => getRespCount(f.id) },
    {
      key: 'estado', header: 'Estado',
      render: (f) => <Badge variant={f.estado === 'activo' ? 'success' : f.estado === 'borrador' ? 'warning' : 'default'}>{f.estado}</Badge>,
    },
    {
      key: 'acciones', header: '',
      render: (f) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/formularios/${f.id}`)}>Ver</Button>
          <Button variant="ghost" size="sm" icon={<Play size={14} />} onClick={() => navigate(`/formularios/${f.id}/ejecutar`)}>Ejecutar</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Formularios Dinámicos"
        subtitle="Catálogo de formularios y tamizajes parametrizados"
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Formularios Dinámicos' }]}
      />

      <div className="rounded-lg border bg-blue-50 border-blue-200 p-3 mb-6 text-sm text-blue-800">
        <strong>TODO-BACKEND:</strong> En producción, los formularios se cargan desde el módulo transversal de SIISMED.
        Esta vista simula la ejecución de formularios configurados dinámicamente.
      </div>

      <DataTable columns={columns} data={formularios} emptyMessage="No hay formularios disponibles." />
    </div>
  )
}
