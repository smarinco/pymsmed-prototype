// ============================================
// Tipos de dominio PYMSMED — Prototipo
// ============================================

// --- Auditoría base ---
export interface AuditFields {
  creadoPor: string
  creadoEn: string
  actualizadoPor: string
  actualizadoEn: string
}

// --- Usuario mock ---
export type RolUsuario =
  | 'administrador'
  | 'supervisor'
  | 'profesional_social'
  | 'profesional_operativo'
  | 'eapb'

export interface UsuarioMock {
  id: string
  nombre: string
  rol: RolUsuario
  contrato: ContratoMock
  permisos: string[]
}

export interface ContratoMock {
  id: string
  numero: string
  proyecto: string
  estado: 'activo' | 'inactivo'
  vigenciaInicio: string
  vigenciaFin: string
}

// --- Contratos (administración) ---
export interface Contrato {
  id: string
  numero: string
  proyecto: string
  objeto: string
  estado: 'activo' | 'inactivo'
  vigenciaInicio: string
  vigenciaFin: string
  profesionalesAsignados: string[]
  presupuesto: number
}

// --- Registro de auditoría ---
export type TipoAccionAuditoria =
  | 'creacion'
  | 'edicion'
  | 'inactivacion'
  | 'cierre'
  | 'reapertura'
  | 'solicitud'
  | 'aprobacion'
  | 'rechazo'

export interface RegistroAuditoria {
  id: string
  fecha: string
  usuario: string
  accion: TipoAccionAuditoria
  modulo: string
  entidadTipo: string
  entidadId: string
  descripcion: string
}

// --- Entorno Hogar ---
export type TipoVivienda = 'casa' | 'apartamento' | 'habitacion' | 'inquilinato' | 'otro'
export type TenenciaVivienda = 'propia' | 'arrendada' | 'familiar' | 'invasion' | 'otra'
export type EstadoHogar = 'activo' | 'inactivo'
export type EstadoCaracterizacion = 'en_progreso' | 'completada'

export interface Hogar extends AuditFields {
  id: string
  codigo: string
  direccion: string
  comuna: string
  barrio: string
  estrato: number
  tipoVivienda: TipoVivienda
  tenencia: TenenciaVivienda
  telefono: string
  observaciones: string
  estado: EstadoHogar
}

export type ParentescoIntegrante =
  | 'jefe_hogar'
  | 'conyuge'
  | 'hijo'
  | 'padre_madre'
  | 'hermano'
  | 'abuelo'
  | 'nieto'
  | 'otro_familiar'
  | 'no_familiar'

export interface IntegranteHogar {
  id: string
  hogarId: string
  personaId: string
  parentesco: ParentescoIntegrante
  esJefeHogar: boolean
}

export interface Caracterizacion extends AuditFields {
  id: string
  hogarId: string
  fecha: string
  profesional: string
  estado: EstadoCaracterizacion
  secciones: SeccionCaracterizacion[]
}

export type DimensionCaracterizacion =
  | 'datos_vivienda'
  | 'vida_saludable'
  | 'salud_mental'
  | 'convivencia_social'
  | 'sexualidad'
  | 'seguridad_alimentaria'

export interface SeccionCaracterizacion {
  dimension: DimensionCaracterizacion
  completada: boolean
  respuestas: Record<string, string | boolean | number>
  riesgos: RiesgoHogar[]
}

export interface RiesgoHogar {
  id: string
  descripcion: string
  nivel: 'bajo' | 'medio' | 'alto'
  integrantesAfectados: string[] // personaId[]
}

export interface SeguimientoCaracterizacion extends AuditFields {
  id: string
  caracterizacionId: string
  hogarId: string
  fecha: string
  profesional: string
  observaciones: string
  riesgosActualizados: { riesgoId: string; nuevoNivel: 'bajo' | 'medio' | 'alto'; nota: string }[]
}

// --- Entorno Comunitario ---
export type EstadoEntorno = 'activo' | 'inactivo'

export type TipoEspacioComunitario =
  | 'centro_comunitario'
  | 'parque'
  | 'cancha'
  | 'salon_comunal'
  | 'iglesia'
  | 'sede_social'
  | 'espacio_publico'
  | 'otro'

export interface EntornoComunitario extends AuditFields {
  id: string
  codigo: string
  nombre: string
  tipoEspacio: TipoEspacioComunitario
  comuna: string
  barrio: string
  direccion: string
  referenteComunitario: string
  telefonoContacto: string
  observaciones: string
  estado: EstadoEntorno
  motivoInactivacion?: string
}

export interface CreateEntornoInput {
  nombre: string
  tipoEspacio: TipoEspacioComunitario
  comuna: string
  barrio: string
  direccion: string
  referenteComunitario: string
  telefonoContacto: string
  observaciones: string
}

export interface UpdateEntornoInput extends Partial<CreateEntornoInput> {}

// --- Visitas ---
export type EstadoVisita = 'abierta' | 'cerrada'

export type Dimension =
  | 'vida_saludable'
  | 'salud_mental'
  | 'convivencia_social'
  | 'sexualidad'
  | 'seguridad_alimentaria'
  | 'salud_ambiental'
  | 'salud_bucal'

export interface Visita extends AuditFields {
  id: string
  entornoId: string
  fecha: string
  dimension: Dimension
  proyecto: string
  profesionalResponsable: string
  lugar: string
  observaciones: string
  estado: EstadoVisita
}

export interface CreateVisitaInput {
  entornoId: string
  fecha: string
  dimension: Dimension
  proyecto: string
  profesionalResponsable: string
  lugar: string
  observaciones: string
}

// --- Personas mock (TODO-SIISMED: viene de Personas Salud) ---
export type TipoDocumento = 'CC' | 'TI' | 'RC' | 'CE' | 'PA' | 'PE'
export type Sexo = 'masculino' | 'femenino' | 'intersexual' | 'no_reporta'

export interface PersonaMock {
  id: string
  tipoDocumento: TipoDocumento
  numeroDocumento: string
  nombres: string
  apellidos: string
  sexo: Sexo
  fechaNacimiento: string
  edad: number
  telefono: string
  eapb: string
}

// --- Participantes ---
export type EstadoSemaforo = 'rojo' | 'amarillo' | 'verde'

export interface Participante extends AuditFields {
  id: string
  visitaId: string
  personaId: string
  semaforo: EstadoSemaforo
}

// --- Atenciones ---
export type EstadoAtencion = 'abierta' | 'finalizada'

export type TipoAtencion =
  | 'tamizaje'
  | 'consejeria'
  | 'educacion_salud'
  | 'valoracion'
  | 'remision'

export interface Atencion extends AuditFields {
  id: string
  participanteId: string
  visitaId: string
  personaId: string
  tipoAtencion: TipoAtencion
  dimension: Dimension
  resultado: string
  riesgoIdentificado: boolean
  requiereCanalizacion: boolean
  estado: EstadoAtencion
}

export interface CreateAtencionInput {
  participanteId: string
  visitaId: string
  personaId: string
  tipoAtencion: TipoAtencion
  dimension: Dimension
  resultado: string
  riesgoIdentificado: boolean
  requiereCanalizacion: boolean
}

// --- Actividades Colectivas ---
export type EstadoActividad = 'programada' | 'aprobada' | 'rechazada' | 'realizada' | 'cancelada'

export type TipoActividad =
  | 'taller'
  | 'jornada_salud'
  | 'charla'
  | 'capacitacion'
  | 'encuentro_comunitario'
  | 'brigada'
  | 'otro'

export interface ActividadColectiva extends AuditFields {
  id: string
  codigo: string
  titulo: string
  tipoActividad: TipoActividad
  dimension: Dimension
  proyecto: string
  fechaProgramada: string
  horario: string
  lugar: string
  profesionalResponsable: string
  descripcion: string
  participantesEsperados: number
  participantesReales?: number
  estado: EstadoActividad
  motivoRechazo?: string
  aprobadoPor?: string
  fechaAprobacion?: string
  // Registro de actividad realizada
  fechaRealizacion?: string
  observacionesRealizacion?: string
  evidencias?: string
}

// --- Canalizaciones ---
export type EstadoCanalizacion =
  | 'generada'
  | 'asignada'
  | 'rechazada'
  | 'reprogramada'
  | 'atendida'
  | 'cerrada'

export type MotivoCanalizacion =
  | 'riesgo_nutricional'
  | 'riesgo_salud_mental'
  | 'riesgo_violencia'
  | 'its_detectada'
  | 'inseguridad_alimentaria'
  | 'control_prenatal'
  | 'riesgo_salud_bucal'
  | 'otro'

export interface Canalizacion extends AuditFields {
  id: string
  codigo: string
  // Origen
  atencionId: string
  visitaId: string
  personaId: string
  profesionalOrigen: string
  // Datos
  motivo: MotivoCanalizacion
  descripcion: string
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  eapbDestino: string
  // Gestión EAPB
  estado: EstadoCanalizacion
  asignadoA?: string
  fechaCita?: string
  motivoRechazo?: string
  fechaReprogramacion?: string
  observacionesSeguimiento?: string
  fechaCierre?: string
}

// --- Solicitudes ---
export type TipoSolicitud = 'edicion' | 'inactivacion' | 'reapertura'
export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada'

// --- Salud Ambiental ---
export type EstadoCaracterizacionAmbiental = 'en_progreso' | 'completada'
export type NivelRiesgoAmbiental = 'sin_riesgo' | 'bajo' | 'medio' | 'alto' | 'critico'

export type DimensionAmbiental =
  | 'agua_saneamiento'
  | 'residuos_solidos'
  | 'vectores_plagas'
  | 'calidad_aire'
  | 'suelo_vivienda'

export interface SeccionAmbiental {
  dimension: DimensionAmbiental
  completada: boolean
  respuestas: Record<string, string | boolean | number>
  nivelRiesgo: NivelRiesgoAmbiental
  observaciones: string
}

export interface CaracterizacionAmbiental extends AuditFields {
  id: string
  codigo: string
  ubicacion: string
  comuna: string
  barrio: string
  tipoZona: 'residencial' | 'comercial' | 'industrial' | 'rural' | 'mixta'
  profesional: string
  fecha: string
  estado: EstadoCaracterizacionAmbiental
  secciones: SeccionAmbiental[]
  riesgoGeneral: NivelRiesgoAmbiental
  recomendaciones: string
}

export interface SeguimientoAmbiental extends AuditFields {
  id: string
  caracterizacionId: string
  fecha: string
  profesional: string
  observaciones: string
  cambiosRiesgo: { dimension: DimensionAmbiental; nuevoNivel: NivelRiesgoAmbiental; nota: string }[]
  nuevoRiesgoGeneral: NivelRiesgoAmbiental
}

// --- Mapeo de Activos ---
export type CategoriaActivo =
  | 'salud'
  | 'educacion'
  | 'recreacion'
  | 'comunitario'
  | 'institucional'
  | 'cultural'
  | 'ambiental'
  | 'economico'

export type EstadoActivo = 'activo' | 'inactivo' | 'en_verificacion'

export interface ActivoTerritorial extends AuditFields {
  id: string
  codigo: string
  nombre: string
  categoria: CategoriaActivo
  comuna: string
  barrio: string
  direccion: string
  descripcion: string
  responsable: string
  telefono: string
  estado: EstadoActivo
  jornadasAsociadas: string[]
  observaciones: string
}

// --- Salas Amigas de la Familia Lactante ---
export type EstadoEmpresaSala = 'identificada' | 'socializada' | 'en_implementacion' | 'certificada' | 'no_aplica'

export interface EmpresaSalaAmiga extends AuditFields {
  id: string
  codigo: string
  nombreEmpresa: string
  nit: string
  sectorEconomico: string
  comuna: string
  barrio: string
  direccion: string
  contactoNombre: string
  contactoCargo: string
  contactoTelefono: string
  numTrabajadores: number
  numMujeresEdadFertil: number
  estado: EstadoEmpresaSala
  tieneSalaAmiga: boolean
  observaciones: string
}

export interface SocializacionNorma extends AuditFields {
  id: string
  empresaId: string
  fecha: string
  profesional: string
  temasTratados: string[]
  asistentes: number
  compromisos: string
  observaciones: string
}

export interface SeguimientoSalaAmiga extends AuditFields {
  id: string
  empresaId: string
  fecha: string
  profesional: string
  tipoVisita: 'verificacion' | 'asesoria' | 'seguimiento'
  cumpleRequisitos: boolean
  hallazgos: string
  recomendaciones: string
  proximaVisita?: string
}

export interface Solicitud extends AuditFields {
  id: string
  tipo: TipoSolicitud
  entidadTipo: 'entorno' | 'visita'
  entidadId: string
  motivo: string
  justificacion: string
  solicitante: string
  estado: EstadoSolicitud
  resueltaPor?: string
  resueltaEn?: string
}
