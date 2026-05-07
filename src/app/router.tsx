import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/shared/layout/AppShell'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { EntornoComunitarioListPage } from '@/modules/entornos/comunitario/pages/EntornoComunitarioListPage'
import { EntornoComunitarioDetailPage } from '@/modules/entornos/comunitario/pages/EntornoComunitarioDetailPage'
import { EntornoComunitarioCreatePage } from '@/modules/entornos/comunitario/pages/EntornoComunitarioCreatePage'
import { EntornoComunitarioEditPage } from '@/modules/entornos/comunitario/pages/EntornoComunitarioEditPage'
import { EntornoComunitarioInactivatePage } from '@/modules/entornos/comunitario/pages/EntornoComunitarioInactivatePage'
import { HogarListPage } from '@/modules/hogares/pages/HogarListPage'
import { HogarDetailPage } from '@/modules/hogares/pages/HogarDetailPage'
import { HogarCreatePage } from '@/modules/hogares/pages/HogarCreatePage'
import { AgregarIntegrantePage } from '@/modules/hogares/pages/AgregarIntegrantePage'
import { CaracterizacionPage } from '@/modules/hogares/pages/CaracterizacionPage'
import { GenericEntornoListPage } from '@/modules/entornos/generic/pages/GenericEntornoListPage'
import { GenericEntornoDetailPage } from '@/modules/entornos/generic/pages/GenericEntornoDetailPage'
import { GenericEntornoCreatePage } from '@/modules/entornos/generic/pages/GenericEntornoCreatePage'
import { entornoConfigs } from '@/modules/entornos/generic/entorno-config'
import { VisitaListPage } from '@/modules/visitas/pages/VisitaListPage'
import { VisitaCreatePage } from '@/modules/visitas/pages/VisitaCreatePage'
import { VisitaDetailPage } from '@/modules/visitas/pages/VisitaDetailPage'
import { ParticipanteListPage } from '@/modules/participantes/pages/ParticipanteListPage'
import { AgregarParticipantePage } from '@/modules/participantes/pages/AgregarParticipantePage'
import { AtencionPage } from '@/modules/atenciones/pages/AtencionPage'
import { SolicitudesPage } from '@/modules/solicitudes/pages/SolicitudesPage'
import { AdminLayout } from '@/modules/administracion/pages/AdminLayout'
import { ContratosPage } from '@/modules/administracion/pages/ContratosPage'
import { AdminSolicitudesPage } from '@/modules/administracion/pages/AdminSolicitudesPage'
import { AuditoriaPage } from '@/modules/administracion/pages/AuditoriaPage'
import { ActividadesListPage } from '@/modules/actividades/pages/ActividadesListPage'
import { ActividadDetailPage } from '@/modules/actividades/pages/ActividadDetailPage'
import { ActividadCreatePage } from '@/modules/actividades/pages/ActividadCreatePage'
import { CanalizacionesListPage } from '@/modules/canalizaciones/pages/CanalizacionesListPage'
import { CanalizacionDetailPage } from '@/modules/canalizaciones/pages/CanalizacionDetailPage'
import { SaludAmbientalListPage } from '@/modules/saludAmbiental/pages/SaludAmbientalListPage'
import { SaludAmbientalDetailPage } from '@/modules/saludAmbiental/pages/SaludAmbientalDetailPage'
import { SaludAmbientalCreatePage } from '@/modules/saludAmbiental/pages/SaludAmbientalCreatePage'
import { ActivosListPage } from '@/modules/activos/pages/ActivosListPage'
import { ActivoDetailPage } from '@/modules/activos/pages/ActivoDetailPage'
import { ActivoCreatePage } from '@/modules/activos/pages/ActivoCreatePage'
import { FormulariosListPage } from '@/modules/formularios/pages/FormulariosListPage'
import { FormularioDetailPage } from '@/modules/formularios/pages/FormularioDetailPage'
import { FormularioEjecutarPage } from '@/modules/formularios/pages/FormularioEjecutarPage'
import { FormularioCreatePage } from '@/modules/formularios/pages/FormularioCreatePage'
import { SalasAmigasListPage } from '@/modules/salasAmigas/pages/SalasAmigasListPage'
import { SalaAmigaDetailPage } from '@/modules/salasAmigas/pages/SalaAmigaDetailPage'
import { SalaAmigaCreatePage } from '@/modules/salasAmigas/pages/SalaAmigaCreatePage'
import { ReportesPage } from '@/modules/reportes/pages/ReportesPage'
import { PlaceholderPage } from '@/shared/components/PlaceholderPage'

const edu = entornoConfigs.educativo
const lab = entornoConfigs.laboral
const inst = entornoConfigs.institucional

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Entorno Comunitario — CRUD completo */}
        <Route path="/entornos/comunitario" element={<EntornoComunitarioListPage />} />
        <Route path="/entornos/comunitario/nuevo" element={<EntornoComunitarioCreatePage />} />
        <Route path="/entornos/comunitario/:id" element={<EntornoComunitarioDetailPage />} />
        <Route path="/entornos/comunitario/:id/editar" element={<EntornoComunitarioEditPage />} />
        <Route path="/entornos/comunitario/:id/inactivar" element={<EntornoComunitarioInactivatePage />} />

        {/* Entorno Hogar */}
        <Route path="/hogares" element={<HogarListPage />} />
        <Route path="/hogares/nuevo" element={<HogarCreatePage />} />
        <Route path="/hogares/:id" element={<HogarDetailPage />} />
        <Route path="/hogares/:id/editar" element={<PlaceholderPage title="Editar Hogar" subtitle="En desarrollo" />} />
        <Route path="/hogares/:hogarId/agregar-integrante" element={<AgregarIntegrantePage />} />
        <Route path="/hogares/:hogarId/caracterizacion/:carId" element={<CaracterizacionPage />} />

        {/* Entorno Educativo — genérico */}
        <Route path="/entornos/educativo" element={<GenericEntornoListPage config={edu} />} />
        <Route path="/entornos/educativo/nuevo" element={<GenericEntornoCreatePage config={edu} />} />
        <Route path="/entornos/educativo/:id" element={<GenericEntornoDetailPage config={edu} />} />
        <Route path="/entornos/educativo/:id/editar" element={<PlaceholderPage title="Editar Entorno Educativo" />} />

        {/* Entorno Laboral — genérico */}
        <Route path="/entornos/laboral" element={<GenericEntornoListPage config={lab} />} />
        <Route path="/entornos/laboral/nuevo" element={<GenericEntornoCreatePage config={lab} />} />
        <Route path="/entornos/laboral/:id" element={<GenericEntornoDetailPage config={lab} />} />
        <Route path="/entornos/laboral/:id/editar" element={<PlaceholderPage title="Editar Entorno Laboral" />} />

        {/* Entorno Institucional — genérico */}
        <Route path="/entornos/institucional" element={<GenericEntornoListPage config={inst} />} />
        <Route path="/entornos/institucional/nuevo" element={<GenericEntornoCreatePage config={inst} />} />
        <Route path="/entornos/institucional/:id" element={<GenericEntornoDetailPage config={inst} />} />
        <Route path="/entornos/institucional/:id/editar" element={<PlaceholderPage title="Editar Entorno Institucional" />} />

        {/* Visitas */}
        <Route path="/entornos/comunitario/:entornoId/visitas/nueva" element={<VisitaCreatePage />} />
        <Route path="/visitas/:id" element={<VisitaDetailPage />} />

        {/* Participantes y Atenciones */}
        <Route path="/visitas/:visitaId/agregar-participante" element={<AgregarParticipantePage />} />
        <Route path="/visitas/:visitaId/participantes/:personaId/atencion" element={<AtencionPage />} />

        {/* Formularios Dinámicos */}
        <Route path="/formularios" element={<FormulariosListPage />} />
        <Route path="/formularios/crear" element={<FormularioCreatePage />} />
        <Route path="/formularios/:id" element={<FormularioDetailPage />} />
        <Route path="/formularios/:id/ejecutar" element={<FormularioEjecutarPage />} />

        {/* Salas Amigas */}
        <Route path="/salas-amigas" element={<SalasAmigasListPage />} />
        <Route path="/salas-amigas/nueva" element={<SalaAmigaCreatePage />} />
        <Route path="/salas-amigas/:id" element={<SalaAmigaDetailPage />} />

        {/* Salud Ambiental */}
        <Route path="/salud-ambiental" element={<SaludAmbientalListPage />} />
        <Route path="/salud-ambiental/nueva" element={<SaludAmbientalCreatePage />} />
        <Route path="/salud-ambiental/:id" element={<SaludAmbientalDetailPage />} />

        {/* Mapeo de Activos */}
        <Route path="/mapeo-activos" element={<ActivosListPage />} />
        <Route path="/mapeo-activos/nuevo" element={<ActivoCreatePage />} />
        <Route path="/mapeo-activos/:id" element={<ActivoDetailPage />} />
        <Route path="/mapeo-activos/:id/editar" element={<PlaceholderPage title="Editar Activo" />} />

        {/* Actividades Colectivas */}
        <Route path="/actividades" element={<ActividadesListPage />} />
        <Route path="/actividades/nueva" element={<ActividadCreatePage />} />
        <Route path="/actividades/:id" element={<ActividadDetailPage />} />

        {/* Canalizaciones */}
        <Route path="/canalizaciones" element={<CanalizacionesListPage />} />
        <Route path="/canalizaciones/:id" element={<CanalizacionDetailPage />} />

        {/* Reportes */}
        <Route path="/reportes" element={<ReportesPage />} />

        {/* Solicitudes */}
        <Route path="/solicitudes" element={<SolicitudesPage />} />

        {/* Listados generales */}
        <Route path="/visitas" element={<VisitaListPage />} />
        <Route path="/participantes" element={<ParticipanteListPage />} />

        {/* Administración */}
        <Route path="/administracion" element={<AdminLayout />}>
          <Route index element={<Navigate to="contratos" replace />} />
          <Route path="contratos" element={<ContratosPage />} />
          <Route path="solicitudes" element={<AdminSolicitudesPage />} />
          <Route path="auditoria" element={<AuditoriaPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PlaceholderPage title="Página no encontrada" subtitle="La ruta solicitada no existe." />} />
      </Route>
    </Routes>
  )
}
