import {
  entornosSeed,
  visitasSeed,
  personasSeed,
  participantesSeed,
  atencionesSeed,
  solicitudesSeed,
  contratosSeed,
  auditoriaSeed,
  hogaresSeed,
  integrantesSeed,
  caracterizacionesSeed,
  seguimientosSeed,
  actividadesSeed,
  canalizacionesSeed,
  caracterizacionesAmbientalesSeed,
  seguimientosAmbientalesSeed,
  activosSeed,
  empresasSalaSeed,
  socializacionesSeed,
  seguimientosSalaSeed,
  formulariosSeed,
  respuestasFormularioSeed,
} from '@/shared/mock/seed-data'

const STORAGE_KEYS = {
  entornos: 'pyms_entornos_comunitarios',
  visitas: 'pyms_visitas',
  personas: 'pyms_personas',
  participantes: 'pyms_participantes',
  atenciones: 'pyms_atenciones',
  solicitudes: 'pyms_solicitudes',
  contratos: 'pyms_contratos',
  auditoria: 'pyms_auditoria',
  hogares: 'pyms_hogares',
  integrantes: 'pyms_integrantes_hogar',
  caracterizaciones: 'pyms_caracterizaciones',
  seguimientos: 'pyms_seguimientos',
  actividades: 'pyms_actividades_colectivas',
  canalizaciones: 'pyms_canalizaciones',
  caracterizacionesAmbientales: 'pyms_caracterizaciones_ambientales',
  seguimientosAmbientales: 'pyms_seguimientos_ambientales',
  activos: 'pyms_activos_territoriales',
  empresasSala: 'pyms_empresas_sala_amiga',
  socializaciones: 'pyms_socializaciones_norma',
  seguimientosSala: 'pyms_seguimientos_sala',
  formularios: 'pyms_formularios_dinamicos',
  respuestasFormulario: 'pyms_respuestas_formulario',
} as const

export function seedIfEmpty(): void {
  const seeds: Record<string, unknown[]> = {
    [STORAGE_KEYS.entornos]: entornosSeed,
    [STORAGE_KEYS.visitas]: visitasSeed,
    [STORAGE_KEYS.personas]: personasSeed,
    [STORAGE_KEYS.participantes]: participantesSeed,
    [STORAGE_KEYS.atenciones]: atencionesSeed,
    [STORAGE_KEYS.solicitudes]: solicitudesSeed,
    [STORAGE_KEYS.contratos]: contratosSeed,
    [STORAGE_KEYS.auditoria]: auditoriaSeed,
    [STORAGE_KEYS.hogares]: hogaresSeed,
    [STORAGE_KEYS.integrantes]: integrantesSeed,
    [STORAGE_KEYS.caracterizaciones]: caracterizacionesSeed,
    [STORAGE_KEYS.seguimientos]: seguimientosSeed,
    [STORAGE_KEYS.actividades]: actividadesSeed,
    [STORAGE_KEYS.canalizaciones]: canalizacionesSeed,
    [STORAGE_KEYS.caracterizacionesAmbientales]: caracterizacionesAmbientalesSeed,
    [STORAGE_KEYS.seguimientosAmbientales]: seguimientosAmbientalesSeed,
    [STORAGE_KEYS.activos]: activosSeed,
    [STORAGE_KEYS.empresasSala]: empresasSalaSeed,
    [STORAGE_KEYS.socializaciones]: socializacionesSeed,
    [STORAGE_KEYS.seguimientosSala]: seguimientosSalaSeed,
    [STORAGE_KEYS.formularios]: formulariosSeed,
    [STORAGE_KEYS.respuestasFormulario]: respuestasFormularioSeed,
  }

  for (const [key, data] of Object.entries(seeds)) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }
}

export function resetAllData(): void {
  localStorage.setItem(STORAGE_KEYS.entornos, JSON.stringify(entornosSeed))
  localStorage.setItem(STORAGE_KEYS.visitas, JSON.stringify(visitasSeed))
  localStorage.setItem(STORAGE_KEYS.personas, JSON.stringify(personasSeed))
  localStorage.setItem(STORAGE_KEYS.participantes, JSON.stringify(participantesSeed))
  localStorage.setItem(STORAGE_KEYS.atenciones, JSON.stringify(atencionesSeed))
  localStorage.setItem(STORAGE_KEYS.solicitudes, JSON.stringify(solicitudesSeed))
  localStorage.setItem(STORAGE_KEYS.contratos, JSON.stringify(contratosSeed))
  localStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(auditoriaSeed))
  localStorage.setItem(STORAGE_KEYS.hogares, JSON.stringify(hogaresSeed))
  localStorage.setItem(STORAGE_KEYS.integrantes, JSON.stringify(integrantesSeed))
  localStorage.setItem(STORAGE_KEYS.caracterizaciones, JSON.stringify(caracterizacionesSeed))
  localStorage.setItem(STORAGE_KEYS.seguimientos, JSON.stringify(seguimientosSeed))
  localStorage.setItem(STORAGE_KEYS.actividades, JSON.stringify(actividadesSeed))
  localStorage.setItem(STORAGE_KEYS.canalizaciones, JSON.stringify(canalizacionesSeed))
  localStorage.setItem(STORAGE_KEYS.caracterizacionesAmbientales, JSON.stringify(caracterizacionesAmbientalesSeed))
  localStorage.setItem(STORAGE_KEYS.seguimientosAmbientales, JSON.stringify(seguimientosAmbientalesSeed))
  localStorage.setItem(STORAGE_KEYS.activos, JSON.stringify(activosSeed))
  localStorage.setItem(STORAGE_KEYS.empresasSala, JSON.stringify(empresasSalaSeed))
  localStorage.setItem(STORAGE_KEYS.socializaciones, JSON.stringify(socializacionesSeed))
  localStorage.setItem(STORAGE_KEYS.seguimientosSala, JSON.stringify(seguimientosSalaSeed))
  localStorage.setItem(STORAGE_KEYS.formularios, JSON.stringify(formulariosSeed))
  localStorage.setItem(STORAGE_KEYS.respuestasFormulario, JSON.stringify(respuestasFormularioSeed))
}

export { STORAGE_KEYS }
