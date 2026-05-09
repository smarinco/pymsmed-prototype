import type {
  EntornoComunitario,
  Visita,
  PersonaMock,
  Participante,
  Atencion,
  Solicitud,
  UsuarioMock,
  Contrato,
  RegistroAuditoria,
  Hogar,
  IntegranteHogar,
  Caracterizacion,
  SeguimientoCaracterizacion,
  ActividadColectiva,
  Canalizacion,
  CaracterizacionAmbiental,
  SeguimientoAmbiental,
  ActivoTerritorial,
  EmpresaSalaAmiga,
  SocializacionNorma,
  SeguimientoSalaAmiga,
  FormularioDinamico,
  RespuestaFormulario,
  EventoCalendario,
} from '@/shared/types/domain'

const now = '2026-05-04T10:00:00'
const audit = {
  creadoPor: 'sistema',
  creadoEn: now,
  actualizadoPor: 'sistema',
  actualizadoEn: now,
}

// --- Usuarios mock ---
export const usuariosMock: UsuarioMock[] = [
  {
    id: 'u1',
    nombre: 'Carlos Gómez',
    rol: 'administrador',
    contrato: { id: 'c1', numero: 'CT-2026-001', proyecto: 'PYMS Medellín', estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31' },
    permisos: ['entornos.read', 'entornos.write', 'visitas.read', 'visitas.write', 'atenciones.read', 'atenciones.write', 'solicitudes.read', 'solicitudes.write', 'administracion.read', 'administracion.write'],
  },
  {
    id: 'u2',
    nombre: 'María López',
    rol: 'supervisor',
    contrato: { id: 'c1', numero: 'CT-2026-001', proyecto: 'PYMS Medellín', estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31' },
    permisos: ['entornos.read', 'entornos.write', 'visitas.read', 'visitas.write', 'atenciones.read', 'atenciones.write', 'solicitudes.read', 'solicitudes.write'],
  },
  {
    id: 'u3',
    nombre: 'Ana Martínez',
    rol: 'profesional_social',
    contrato: { id: 'c1', numero: 'CT-2026-001', proyecto: 'PYMS Medellín', estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31' },
    permisos: ['entornos.read', 'visitas.read', 'visitas.write', 'atenciones.read', 'atenciones.write', 'solicitudes.read'],
  },
  {
    id: 'u4',
    nombre: 'Jorge Restrepo',
    rol: 'profesional_operativo',
    contrato: { id: 'c1', numero: 'CT-2026-001', proyecto: 'PYMS Medellín', estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31' },
    permisos: ['entornos.read', 'visitas.read', 'visitas.write', 'atenciones.read', 'atenciones.write'],
  },
  {
    id: 'u5',
    nombre: 'Laura Vélez',
    rol: 'eapb',
    contrato: { id: 'c2', numero: 'CT-2026-002', proyecto: 'EAPB Sura', estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31' },
    permisos: ['canalizaciones.read', 'canalizaciones.write'],
  },
]

// --- Entornos Comunitarios ---
export const entornosSeed: EntornoComunitario[] = [
  {
    id: 'ec1', codigo: 'EC-001', nombre: 'Centro Comunitario La Esperanza', tipoEspacio: 'centro_comunitario',
    comuna: '1 - Popular', barrio: 'Santo Domingo', direccion: 'Cra 32 #107-20',
    referenteComunitario: 'Doña Rosa Mejía', telefonoContacto: '3101234567',
    observaciones: 'Espacio principal para jornadas de salud en la comuna 1.', estado: 'activo', ...audit,
  },
  {
    id: 'ec2', codigo: 'EC-002', nombre: 'Parque Recreativo San Javier', tipoEspacio: 'parque',
    comuna: '13 - San Javier', barrio: 'San Javier', direccion: 'Cll 44 #98-12',
    referenteComunitario: 'Juan Carlos Pérez', telefonoContacto: '3209876543',
    observaciones: 'Parque con zonas verdes para actividades colectivas.', estado: 'activo', ...audit,
  },
  {
    id: 'ec3', codigo: 'EC-003', nombre: 'Salón Comunal Manrique', tipoEspacio: 'salon_comunal',
    comuna: '3 - Manrique', barrio: 'Manrique Central', direccion: 'Cra 45 #75-30',
    referenteComunitario: 'Marta Londoño', telefonoContacto: '3157654321',
    observaciones: 'Salón con capacidad para 60 personas.', estado: 'activo', ...audit,
  },
  {
    id: 'ec4', codigo: 'EC-004', nombre: 'Sede Social Villa Hermosa', tipoEspacio: 'sede_social',
    comuna: '8 - Villa Hermosa', barrio: 'Villa Hermosa', direccion: 'Cll 56 #28-10',
    referenteComunitario: 'Pedro Arias', telefonoContacto: '3004567890',
    observaciones: 'Sede de la JAC del barrio.', estado: 'activo', ...audit,
  },
  {
    id: 'ec5', codigo: 'EC-005', nombre: 'Iglesia Santa Ana Castilla', tipoEspacio: 'iglesia',
    comuna: '5 - Castilla', barrio: 'Castilla', direccion: 'Cra 65 #90-15',
    referenteComunitario: 'Padre Miguel Ángel', telefonoContacto: '3112345678',
    observaciones: 'Espacio prestado para jornadas, solo fines de semana.', estado: 'inactivo',
    motivoInactivacion: 'Espacio no disponible temporalmente por remodelación.',
    ...audit,
  },
]

// --- Personas mock ---
export const personasSeed: PersonaMock[] = [
  { id: 'p1', tipoDocumento: 'CC', numeroDocumento: '1017234567', nombres: 'Andrés Felipe', apellidos: 'García Muñoz', sexo: 'masculino', fechaNacimiento: '1990-03-15', edad: 36, telefono: '3001112233', eapb: 'Sura EPS' },
  { id: 'p2', tipoDocumento: 'CC', numeroDocumento: '1039876543', nombres: 'Luisa Fernanda', apellidos: 'Ríos Cardona', sexo: 'femenino', fechaNacimiento: '1985-07-22', edad: 40, telefono: '3104445566', eapb: 'Nueva EPS' },
  { id: 'p3', tipoDocumento: 'TI', numeroDocumento: '1035678901', nombres: 'Valentina', apellidos: 'Ospina Mejía', sexo: 'femenino', fechaNacimiento: '2010-11-03', edad: 15, telefono: '3207778899', eapb: 'Savia Salud' },
  { id: 'p4', tipoDocumento: 'CC', numeroDocumento: '70456789', nombres: 'Hernán Darío', apellidos: 'Betancur López', sexo: 'masculino', fechaNacimiento: '1962-01-28', edad: 64, telefono: '3149990011', eapb: 'Sura EPS' },
  { id: 'p5', tipoDocumento: 'CC', numeroDocumento: '43567890', nombres: 'Gloria Patricia', apellidos: 'Vélez Soto', sexo: 'femenino', fechaNacimiento: '1975-09-10', edad: 50, telefono: '3052223344', eapb: 'Coosalud' },
  { id: 'p6', tipoDocumento: 'CE', numeroDocumento: 'E234567', nombres: 'Carlos Andrés', apellidos: 'Mendoza Ruiz', sexo: 'masculino', fechaNacimiento: '1998-05-20', edad: 28, telefono: '3186667788', eapb: 'Savia Salud' },
  { id: 'p7', tipoDocumento: 'RC', numeroDocumento: '1041234567', nombres: 'Samuel', apellidos: 'García Ríos', sexo: 'masculino', fechaNacimiento: '2022-02-14', edad: 4, telefono: '3001112233', eapb: 'Sura EPS' },
  { id: 'p8', tipoDocumento: 'CC', numeroDocumento: '1028765432', nombres: 'Diana Marcela', apellidos: 'Correa Henao', sexo: 'femenino', fechaNacimiento: '1992-12-05', edad: 33, telefono: '3003334455', eapb: 'Nueva EPS' },
]

// --- Visitas ---
export const visitasSeed: Visita[] = [
  {
    id: 'v1', entornoId: 'ec1', fecha: '2026-04-28', dimension: 'vida_saludable', proyecto: 'PYMS Medellín',
    profesionalResponsable: 'Ana Martínez', lugar: 'Centro Comunitario La Esperanza',
    observaciones: 'Jornada de tamizaje nutricional.', estado: 'abierta', ...audit,
  },
  {
    id: 'v2', entornoId: 'ec1', fecha: '2026-04-15', dimension: 'salud_mental', proyecto: 'PYMS Medellín',
    profesionalResponsable: 'Jorge Restrepo', lugar: 'Centro Comunitario La Esperanza',
    observaciones: 'Sesión grupal de salud mental.', estado: 'cerrada', ...audit,
  },
  {
    id: 'v3', entornoId: 'ec2', fecha: '2026-05-01', dimension: 'convivencia_social', proyecto: 'PYMS Medellín',
    profesionalResponsable: 'Ana Martínez', lugar: 'Parque Recreativo San Javier',
    observaciones: 'Actividad de convivencia comunitaria.', estado: 'abierta', ...audit,
  },
  {
    id: 'v4', entornoId: 'ec3', fecha: '2026-04-20', dimension: 'sexualidad', proyecto: 'PYMS Medellín',
    profesionalResponsable: 'Jorge Restrepo', lugar: 'Salón Comunal Manrique',
    observaciones: 'Taller de derechos sexuales y reproductivos.', estado: 'cerrada', ...audit,
  },
  {
    id: 'v5', entornoId: 'ec4', fecha: '2026-05-03', dimension: 'seguridad_alimentaria', proyecto: 'PYMS Medellín',
    profesionalResponsable: 'Ana Martínez', lugar: 'Sede Social Villa Hermosa',
    observaciones: 'Valoración nutricional infantil.', estado: 'abierta', ...audit,
  },
]

// --- Participantes ---
export const participantesSeed: Participante[] = [
  { id: 'pa1', visitaId: 'v1', personaId: 'p1', semaforo: 'verde', ...audit },
  { id: 'pa2', visitaId: 'v1', personaId: 'p2', semaforo: 'amarillo', ...audit },
  { id: 'pa3', visitaId: 'v1', personaId: 'p3', semaforo: 'rojo', ...audit },
  { id: 'pa4', visitaId: 'v2', personaId: 'p4', semaforo: 'verde', ...audit },
  { id: 'pa5', visitaId: 'v2', personaId: 'p5', semaforo: 'verde', ...audit },
  { id: 'pa6', visitaId: 'v3', personaId: 'p6', semaforo: 'rojo', ...audit },
  { id: 'pa7', visitaId: 'v3', personaId: 'p1', semaforo: 'amarillo', ...audit },
  { id: 'pa8', visitaId: 'v5', personaId: 'p7', semaforo: 'rojo', ...audit },
  { id: 'pa9', visitaId: 'v5', personaId: 'p8', semaforo: 'rojo', ...audit },
]

// --- Atenciones ---
export const atencionesSeed: Atencion[] = [
  {
    id: 'at1', participanteId: 'pa1', visitaId: 'v1', personaId: 'p1',
    tipoAtencion: 'tamizaje', dimension: 'vida_saludable', resultado: 'Sin hallazgos relevantes.',
    riesgoIdentificado: false, requiereCanalizacion: false, estado: 'finalizada', ...audit,
  },
  {
    id: 'at2', participanteId: 'pa2', visitaId: 'v1', personaId: 'p2',
    tipoAtencion: 'valoracion', dimension: 'vida_saludable', resultado: 'IMC elevado, requiere seguimiento.',
    riesgoIdentificado: true, requiereCanalizacion: false, estado: 'abierta', ...audit,
  },
  {
    id: 'at3', participanteId: 'pa4', visitaId: 'v2', personaId: 'p4',
    tipoAtencion: 'consejeria', dimension: 'salud_mental', resultado: 'Sesión completada satisfactoriamente.',
    riesgoIdentificado: false, requiereCanalizacion: false, estado: 'finalizada', ...audit,
  },
  {
    id: 'at4', participanteId: 'pa5', visitaId: 'v2', personaId: 'p5',
    tipoAtencion: 'consejeria', dimension: 'salud_mental', resultado: 'Participó activamente en la sesión.',
    riesgoIdentificado: false, requiereCanalizacion: false, estado: 'finalizada', ...audit,
  },
]

// --- Solicitudes ---
export const solicitudesSeed: Solicitud[] = [
  {
    id: 's1', tipo: 'reapertura', entidadTipo: 'visita', entidadId: 'v2',
    motivo: 'Faltó registrar un participante', justificacion: 'Se detectó que no se incluyó a un asistente.',
    solicitante: 'Ana Martínez', estado: 'pendiente', ...audit,
  },
  {
    id: 's2', tipo: 'edicion', entidadTipo: 'entorno', entidadId: 'ec3',
    motivo: 'Corrección de dirección', justificacion: 'La dirección registrada tiene un error de nomenclatura.',
    solicitante: 'Jorge Restrepo', estado: 'aprobada', resueltaPor: 'Carlos Gómez', resueltaEn: '2026-04-22T14:00:00', ...audit,
  },
  {
    id: 's3', tipo: 'inactivacion', entidadTipo: 'entorno', entidadId: 'ec4',
    motivo: 'Cierre temporal', justificacion: 'La sede estará en mantenimiento por 3 meses.',
    solicitante: 'María López', estado: 'rechazada', resueltaPor: 'Carlos Gómez', resueltaEn: '2026-04-25T09:00:00', ...audit,
  },
]

// --- Contratos ---
export const contratosSeed: Contrato[] = [
  {
    id: 'c1', numero: 'CT-2026-001', proyecto: 'PYMS Medellín', objeto: 'Prestación de servicios de promoción y mantenimiento de la salud en las 16 comunas de Medellín.',
    estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31',
    profesionalesAsignados: ['Carlos Gómez', 'María López', 'Ana Martínez', 'Jorge Restrepo'],
    presupuesto: 850000000,
  },
  {
    id: 'c2', numero: 'CT-2026-002', proyecto: 'EAPB Sura', objeto: 'Gestión de canalizaciones y seguimiento de atenciones para afiliados Sura EPS.',
    estado: 'activo', vigenciaInicio: '2026-01-01', vigenciaFin: '2026-12-31',
    profesionalesAsignados: ['Laura Vélez'],
    presupuesto: 320000000,
  },
  {
    id: 'c3', numero: 'CT-2025-018', proyecto: 'PYMS Medellín 2025', objeto: 'Contrato de vigencia anterior para operación PYMS.',
    estado: 'inactivo', vigenciaInicio: '2025-01-01', vigenciaFin: '2025-12-31',
    profesionalesAsignados: ['Carlos Gómez', 'Ana Martínez'],
    presupuesto: 780000000,
  },
  {
    id: 'c4', numero: 'CT-2026-003', proyecto: 'Salud Ambiental Medellín', objeto: 'Caracterizaciones ambientales y seguimientos en zonas priorizadas.',
    estado: 'activo', vigenciaInicio: '2026-03-01', vigenciaFin: '2026-11-30',
    profesionalesAsignados: ['María López', 'Jorge Restrepo'],
    presupuesto: 450000000,
  },
]

// --- Auditoría ---
export const auditoriaSeed: RegistroAuditoria[] = [
  { id: 'aud1', fecha: '2026-04-10T08:30:00', usuario: 'Carlos Gómez', accion: 'creacion', modulo: 'Entornos', entidadTipo: 'entorno', entidadId: 'ec1', descripcion: 'Creó el entorno Centro Comunitario La Esperanza.' },
  { id: 'aud2', fecha: '2026-04-10T09:00:00', usuario: 'Carlos Gómez', accion: 'creacion', modulo: 'Entornos', entidadTipo: 'entorno', entidadId: 'ec2', descripcion: 'Creó el entorno Parque Recreativo San Javier.' },
  { id: 'aud3', fecha: '2026-04-12T10:15:00', usuario: 'María López', accion: 'creacion', modulo: 'Entornos', entidadTipo: 'entorno', entidadId: 'ec3', descripcion: 'Creó el entorno Salón Comunal Manrique.' },
  { id: 'aud4', fecha: '2026-04-15T14:00:00', usuario: 'Ana Martínez', accion: 'creacion', modulo: 'Visitas', entidadTipo: 'visita', entidadId: 'v1', descripcion: 'Creó visita de Vida Saludable en Centro Comunitario La Esperanza.' },
  { id: 'aud5', fecha: '2026-04-15T16:30:00', usuario: 'Jorge Restrepo', accion: 'creacion', modulo: 'Visitas', entidadTipo: 'visita', entidadId: 'v2', descripcion: 'Creó visita de Salud Mental en Centro Comunitario La Esperanza.' },
  { id: 'aud6', fecha: '2026-04-16T09:00:00', usuario: 'Jorge Restrepo', accion: 'cierre', modulo: 'Visitas', entidadTipo: 'visita', entidadId: 'v2', descripcion: 'Cerró la visita de Salud Mental.' },
  { id: 'aud7', fecha: '2026-04-18T11:00:00', usuario: 'Ana Martínez', accion: 'creacion', modulo: 'Atenciones', entidadTipo: 'atencion', entidadId: 'at1', descripcion: 'Registró tamizaje para Andrés Felipe García Muñoz.' },
  { id: 'aud8', fecha: '2026-04-20T10:00:00', usuario: 'Jorge Restrepo', accion: 'solicitud', modulo: 'Solicitudes', entidadTipo: 'solicitud', entidadId: 's2', descripcion: 'Solicitó edición del entorno Salón Comunal Manrique.' },
  { id: 'aud9', fecha: '2026-04-22T14:00:00', usuario: 'Carlos Gómez', accion: 'aprobacion', modulo: 'Solicitudes', entidadTipo: 'solicitud', entidadId: 's2', descripcion: 'Aprobó solicitud de edición del entorno Salón Comunal Manrique.' },
  { id: 'aud10', fecha: '2026-04-25T09:00:00', usuario: 'Carlos Gómez', accion: 'rechazo', modulo: 'Solicitudes', entidadTipo: 'solicitud', entidadId: 's3', descripcion: 'Rechazó solicitud de inactivación de Sede Social Villa Hermosa.' },
  { id: 'aud11', fecha: '2026-04-28T08:00:00', usuario: 'Carlos Gómez', accion: 'inactivacion', modulo: 'Entornos', entidadTipo: 'entorno', entidadId: 'ec5', descripcion: 'Inactivó el entorno Iglesia Santa Ana Castilla por remodelación.' },
  { id: 'aud12', fecha: '2026-05-01T10:30:00', usuario: 'Ana Martínez', accion: 'creacion', modulo: 'Visitas', entidadTipo: 'visita', entidadId: 'v3', descripcion: 'Creó visita de Convivencia Social en Parque Recreativo San Javier.' },
]

// --- Hogares ---
export const hogaresSeed: Hogar[] = [
  {
    id: 'h1', codigo: 'HG-001', direccion: 'Cra 32 #105-15, Apto 301', comuna: '1 - Popular', barrio: 'Santo Domingo',
    estrato: 1, tipoVivienda: 'apartamento', tenencia: 'arrendada', telefono: '3001112233',
    observaciones: 'Familia de 4 integrantes, zona de ladera.', estado: 'activo', ...audit,
  },
  {
    id: 'h2', codigo: 'HG-002', direccion: 'Cll 44 #96-08', comuna: '13 - San Javier', barrio: 'San Javier',
    estrato: 2, tipoVivienda: 'casa', tenencia: 'propia', telefono: '3209876543',
    observaciones: 'Hogar con adulto mayor y menor de 5 años.', estado: 'activo', ...audit,
  },
  {
    id: 'h3', codigo: 'HG-003', direccion: 'Cra 45 #73-12', comuna: '3 - Manrique', barrio: 'Manrique Central',
    estrato: 2, tipoVivienda: 'casa', tenencia: 'familiar', telefono: '3157654321',
    observaciones: 'Hogar extenso con 6 integrantes.', estado: 'activo', ...audit,
  },
  {
    id: 'h4', codigo: 'HG-004', direccion: 'Cll 56 #27-05', comuna: '8 - Villa Hermosa', barrio: 'Villa Hermosa',
    estrato: 1, tipoVivienda: 'habitacion', tenencia: 'arrendada', telefono: '3004567890',
    observaciones: 'Madre cabeza de hogar con 2 hijos.', estado: 'inactivo', ...audit,
  },
]

// --- Integrantes de hogar ---
export const integrantesSeed: IntegranteHogar[] = [
  // Hogar 1: familia García-Ríos
  { id: 'ih1', hogarId: 'h1', personaId: 'p1', parentesco: 'jefe_hogar', esJefeHogar: true },
  { id: 'ih2', hogarId: 'h1', personaId: 'p2', parentesco: 'conyuge', esJefeHogar: false },
  { id: 'ih3', hogarId: 'h1', personaId: 'p7', parentesco: 'hijo', esJefeHogar: false },
  // Hogar 2: familia Betancur-Vélez
  { id: 'ih4', hogarId: 'h2', personaId: 'p4', parentesco: 'jefe_hogar', esJefeHogar: true },
  { id: 'ih5', hogarId: 'h2', personaId: 'p5', parentesco: 'conyuge', esJefeHogar: false },
  { id: 'ih6', hogarId: 'h2', personaId: 'p3', parentesco: 'nieto', esJefeHogar: false },
  // Hogar 3: familia Correa
  { id: 'ih7', hogarId: 'h3', personaId: 'p8', parentesco: 'jefe_hogar', esJefeHogar: true },
  { id: 'ih8', hogarId: 'h3', personaId: 'p6', parentesco: 'hermano', esJefeHogar: false },
]

// --- Caracterizaciones ---
export const caracterizacionesSeed: Caracterizacion[] = [
  {
    id: 'car1', hogarId: 'h1', fecha: '2026-04-20', profesional: 'Ana Martínez', estado: 'completada',
    secciones: [
      {
        dimension: 'datos_vivienda', completada: true,
        respuestas: { pisosMaterial: 'cemento', techoMaterial: 'eternit', aguaPotable: true, alcantarillado: true, recoleccionBasuras: true },
        riesgos: [],
      },
      {
        dimension: 'vida_saludable', completada: true,
        respuestas: { alimentacionBalanceada: false, actividadFisica: true, consumoFrutas: false },
        riesgos: [
          { id: 'r1', descripcion: 'Alimentación no balanceada', nivel: 'medio', integrantesAfectados: ['p1', 'p2', 'p7'] },
        ],
      },
      {
        dimension: 'salud_mental', completada: true,
        respuestas: { antecedentesDepresion: false, violenciaIntrafamiliar: false, consumoSPA: false },
        riesgos: [],
      },
      {
        dimension: 'convivencia_social', completada: true,
        respuestas: { relacionesVecinales: true, participacionComunitaria: true, redesApoyo: true },
        riesgos: [],
      },
      {
        dimension: 'sexualidad', completada: true,
        respuestas: { planificacionFamiliar: true, controlPrenatal: false, its: false },
        riesgos: [],
      },
      {
        dimension: 'seguridad_alimentaria', completada: true,
        respuestas: { accesoAlimentos: true, frecuenciaComidas: 3, inseguridadAlimentaria: false },
        riesgos: [],
      },
    ],
    ...audit,
  },
  {
    id: 'car2', hogarId: 'h2', fecha: '2026-04-25', profesional: 'Jorge Restrepo', estado: 'en_progreso',
    secciones: [
      {
        dimension: 'datos_vivienda', completada: true,
        respuestas: { pisosMaterial: 'baldosa', techoMaterial: 'concreto', aguaPotable: true, alcantarillado: true, recoleccionBasuras: true },
        riesgos: [],
      },
      {
        dimension: 'vida_saludable', completada: true,
        respuestas: { alimentacionBalanceada: true, actividadFisica: false, consumoFrutas: true },
        riesgos: [
          { id: 'r2', descripcion: 'Sedentarismo en adulto mayor', nivel: 'alto', integrantesAfectados: ['p4'] },
        ],
      },
      {
        dimension: 'salud_mental', completada: false,
        respuestas: {},
        riesgos: [],
      },
      { dimension: 'convivencia_social', completada: false, respuestas: {}, riesgos: [] },
      { dimension: 'sexualidad', completada: false, respuestas: {}, riesgos: [] },
      { dimension: 'seguridad_alimentaria', completada: false, respuestas: {}, riesgos: [] },
    ],
    ...audit,
  },
]

// --- Seguimientos ---
export const seguimientosSeed: SeguimientoCaracterizacion[] = [
  {
    id: 'seg1', caracterizacionId: 'car1', hogarId: 'h1', fecha: '2026-05-02', profesional: 'Ana Martínez',
    observaciones: 'Se verificó mejora en hábitos alimenticios. La familia reporta que empezó a incluir más frutas.',
    riesgosActualizados: [
      { riesgoId: 'r1', nuevoNivel: 'bajo', nota: 'Familia reporta mejora tras consejería nutricional.' },
    ],
    ...audit,
  },
]

// --- Actividades Colectivas ---
export const actividadesSeed: ActividadColectiva[] = [
  {
    id: 'ac1', codigo: 'AC-001', titulo: 'Jornada de Tamizaje Nutricional', tipoActividad: 'jornada_salud',
    dimension: 'vida_saludable', proyecto: 'PYMS Medellín', fechaProgramada: '2026-05-10', horario: '8:00 - 12:00',
    lugar: 'Centro Comunitario La Esperanza', profesionalResponsable: 'Ana Martínez',
    descripcion: 'Jornada de tamizaje nutricional para población infantil y adultos mayores de la comuna 1.',
    participantesEsperados: 80, estado: 'aprobada', aprobadoPor: 'María López', fechaAprobacion: '2026-05-02T10:00:00',
    ...audit,
  },
  {
    id: 'ac2', codigo: 'AC-002', titulo: 'Taller de Salud Mental Comunitaria', tipoActividad: 'taller',
    dimension: 'salud_mental', proyecto: 'PYMS Medellín', fechaProgramada: '2026-05-12', horario: '14:00 - 17:00',
    lugar: 'Salón Comunal Manrique', profesionalResponsable: 'Jorge Restrepo',
    descripcion: 'Taller grupal sobre manejo del estrés y habilidades de afrontamiento.',
    participantesEsperados: 30, estado: 'programada',
    ...audit,
  },
  {
    id: 'ac3', codigo: 'AC-003', titulo: 'Charla Derechos Sexuales y Reproductivos', tipoActividad: 'charla',
    dimension: 'sexualidad', proyecto: 'PYMS Medellín', fechaProgramada: '2026-04-28', horario: '10:00 - 12:00',
    lugar: 'I.E. Félix de Bedout Moreno', profesionalResponsable: 'Ana Martínez',
    descripcion: 'Charla dirigida a estudiantes de 9° y 10° sobre derechos sexuales y reproductivos.',
    participantesEsperados: 60, participantesReales: 55, estado: 'realizada',
    fechaRealizacion: '2026-04-28', observacionesRealizacion: 'Alta participación. Se identificaron 3 estudiantes para seguimiento individual.',
    ...audit,
  },
  {
    id: 'ac4', codigo: 'AC-004', titulo: 'Brigada de Salud Oral', tipoActividad: 'brigada',
    dimension: 'salud_bucal', proyecto: 'PYMS Medellín', fechaProgramada: '2026-05-15', horario: '8:00 - 16:00',
    lugar: 'Parque Recreativo San Javier', profesionalResponsable: 'Jorge Restrepo',
    descripcion: 'Brigada de salud oral con aplicación de flúor y educación en higiene bucal.',
    participantesEsperados: 120, estado: 'rechazada',
    motivoRechazo: 'Conflicto de cronograma con jornada de vacunación. Reprogramar para la semana siguiente.',
    ...audit,
  },
  {
    id: 'ac5', codigo: 'AC-005', titulo: 'Encuentro de Seguridad Alimentaria', tipoActividad: 'encuentro_comunitario',
    dimension: 'seguridad_alimentaria', proyecto: 'PYMS Medellín', fechaProgramada: '2026-05-20', horario: '9:00 - 13:00',
    lugar: 'Sede Social Villa Hermosa', profesionalResponsable: 'Ana Martínez',
    descripcion: 'Encuentro comunitario sobre huertas caseras y preparación de alimentos nutritivos.',
    participantesEsperados: 40, estado: 'programada',
    ...audit,
  },
]

// --- Canalizaciones ---
export const canalizacionesSeed: Canalizacion[] = [
  {
    id: 'can1', codigo: 'CAN-001', atencionId: 'at2', visitaId: 'v1', personaId: 'p2',
    profesionalOrigen: 'Ana Martínez', motivo: 'riesgo_nutricional',
    descripcion: 'Paciente con IMC elevado. Requiere valoración por nutrición.',
    prioridad: 'media', eapbDestino: 'Nueva EPS', estado: 'generada',
    ...audit,
  },
  {
    id: 'can2', codigo: 'CAN-002', atencionId: 'at1', visitaId: 'v1', personaId: 'p1',
    profesionalOrigen: 'Ana Martínez', motivo: 'control_prenatal',
    descripcion: 'Requiere control prenatal de seguimiento. Embarazo de 28 semanas.',
    prioridad: 'alta', eapbDestino: 'Sura EPS', estado: 'asignada',
    asignadoA: 'Dra. Patricia Henao', fechaCita: '2026-05-15',
    ...audit,
  },
  {
    id: 'can3', codigo: 'CAN-003', atencionId: 'at3', visitaId: 'v2', personaId: 'p4',
    profesionalOrigen: 'Jorge Restrepo', motivo: 'riesgo_salud_mental',
    descripcion: 'Adulto mayor con síntomas depresivos. Derivar a psicología.',
    prioridad: 'alta', eapbDestino: 'Sura EPS', estado: 'atendida',
    asignadoA: 'Psic. Camila Restrepo', fechaCita: '2026-04-30',
    observacionesSeguimiento: 'Paciente asistió a consulta. Inicia terapia cognitiva.',
    ...audit,
  },
  {
    id: 'can4', codigo: 'CAN-004', atencionId: 'at4', visitaId: 'v2', personaId: 'p5',
    profesionalOrigen: 'Jorge Restrepo', motivo: 'riesgo_salud_bucal',
    descripcion: 'Caries múltiples detectadas. Necesita atención odontológica urgente.',
    prioridad: 'urgente', eapbDestino: 'Coosalud', estado: 'rechazada',
    motivoRechazo: 'Paciente no se encuentra afiliada a esta EPS. Verificar base de datos.',
    ...audit,
  },
  {
    id: 'can5', codigo: 'CAN-005', atencionId: 'at2', visitaId: 'v1', personaId: 'p2',
    profesionalOrigen: 'Ana Martínez', motivo: 'inseguridad_alimentaria',
    descripcion: 'Familia reporta acceso limitado a alimentos. Derivar a programa social.',
    prioridad: 'media', eapbDestino: 'Nueva EPS', estado: 'reprogramada',
    asignadoA: 'T.S. María Eugenia Correa', fechaCita: '2026-05-08',
    fechaReprogramacion: '2026-05-22',
    observacionesSeguimiento: 'Se reprograma por inasistencia. Contacto telefónico exitoso.',
    ...audit,
  },
  {
    id: 'can6', codigo: 'CAN-006', atencionId: 'at3', visitaId: 'v2', personaId: 'p4',
    profesionalOrigen: 'Jorge Restrepo', motivo: 'otro',
    descripcion: 'Adulto mayor requiere valoración geriátrica integral.',
    prioridad: 'baja', eapbDestino: 'Sura EPS', estado: 'cerrada',
    asignadoA: 'Dr. Fernando Uribe', fechaCita: '2026-04-25',
    observacionesSeguimiento: 'Valoración completada. Plan de manejo establecido. Se cierra seguimiento.',
    fechaCierre: '2026-05-01',
    ...audit,
  },
]

// --- Caracterizaciones Ambientales ---
export const caracterizacionesAmbientalesSeed: CaracterizacionAmbiental[] = [
  {
    id: 'ca1', codigo: 'SA-001', ubicacion: 'Quebrada La Herrera - Tramo zona 1', comuna: '1 - Popular', barrio: 'Santo Domingo',
    tipoZona: 'residencial', profesional: 'María López', fecha: '2026-04-18', estado: 'completada',
    secciones: [
      { dimension: 'agua_saneamiento', completada: true, respuestas: { fuenteAgua: 'acueducto', aguaPotable: true, alcantarillado: true, vertimientosVisibles: true, aguasEstancadas: false }, nivelRiesgo: 'medio', observaciones: 'Se observan vertimientos de aguas grises hacia la quebrada.' },
      { dimension: 'residuos_solidos', completada: true, respuestas: { recoleccionRegular: true, puntosAcumulacion: true, reciclaje: false, residuosPeligrosos: false }, nivelRiesgo: 'medio', observaciones: 'Acumulación de residuos cerca de la quebrada.' },
      { dimension: 'vectores_plagas', completada: true, respuestas: { presenciaRoedores: true, presenciaMosquitos: true, criaderosMosquitos: true, animalesCallejeros: false }, nivelRiesgo: 'alto', observaciones: 'Criaderos de mosquitos en aguas estancadas. Alto riesgo de dengue.' },
      { dimension: 'calidad_aire', completada: true, respuestas: { fuentesContaminacion: false, quemaResiduos: false, polvoExcesivo: false, oloresDesagradables: true }, nivelRiesgo: 'bajo', observaciones: 'Olores por vertimientos pero sin fuentes de contaminación del aire.' },
      { dimension: 'suelo_vivienda', completada: true, respuestas: { zonaInundable: true, terrenoInestable: false, viviendasEnRiesgo: true, infraestructuraAdecuada: false }, nivelRiesgo: 'alto', observaciones: 'Viviendas en zona de retiro de quebrada, riesgo de inundación.' },
    ],
    riesgoGeneral: 'alto',
    recomendaciones: 'Se requiere intervención prioritaria: control de vectores, reubicación de vertimientos y evaluación de viviendas en zona de retiro.',
    ...audit,
  },
  {
    id: 'ca2', codigo: 'SA-002', ubicacion: 'Sector comercial Cll 44 con Cra 65', comuna: '13 - San Javier', barrio: 'San Javier',
    tipoZona: 'comercial', profesional: 'Jorge Restrepo', fecha: '2026-04-25', estado: 'completada',
    secciones: [
      { dimension: 'agua_saneamiento', completada: true, respuestas: { fuenteAgua: 'acueducto', aguaPotable: true, alcantarillado: true, vertimientosVisibles: false, aguasEstancadas: false }, nivelRiesgo: 'sin_riesgo', observaciones: 'Infraestructura adecuada.' },
      { dimension: 'residuos_solidos', completada: true, respuestas: { recoleccionRegular: true, puntosAcumulacion: true, reciclaje: false, residuosPeligrosos: false }, nivelRiesgo: 'bajo', observaciones: 'Algunos puntos de acumulación pero con recolección regular.' },
      { dimension: 'vectores_plagas', completada: true, respuestas: { presenciaRoedores: false, presenciaMosquitos: false, criaderosMosquitos: false, animalesCallejeros: true }, nivelRiesgo: 'bajo', observaciones: 'Presencia de perros callejeros, sin riesgo sanitario mayor.' },
      { dimension: 'calidad_aire', completada: true, respuestas: { fuentesContaminacion: true, quemaResiduos: false, polvoExcesivo: false, oloresDesagradables: false }, nivelRiesgo: 'bajo', observaciones: 'Emisiones vehiculares normales para zona comercial.' },
      { dimension: 'suelo_vivienda', completada: true, respuestas: { zonaInundable: false, terrenoInestable: false, viviendasEnRiesgo: false, infraestructuraAdecuada: true }, nivelRiesgo: 'sin_riesgo', observaciones: 'Zona estable.' },
    ],
    riesgoGeneral: 'bajo',
    recomendaciones: 'Zona con condiciones ambientales aceptables. Mantener vigilancia de residuos sólidos.',
    ...audit,
  },
  {
    id: 'ca3', codigo: 'SA-003', ubicacion: 'Asentamiento informal Loma de los González', comuna: '8 - Villa Hermosa', barrio: 'Villa Hermosa',
    tipoZona: 'residencial', profesional: 'María López', fecha: '2026-05-02', estado: 'en_progreso',
    secciones: [
      { dimension: 'agua_saneamiento', completada: true, respuestas: { fuenteAgua: 'pila_publica', aguaPotable: false, alcantarillado: false, vertimientosVisibles: true, aguasEstancadas: true }, nivelRiesgo: 'critico', observaciones: 'Sin acueducto formal. Agua de pila pública no potabilizada. Sin alcantarillado.' },
      { dimension: 'residuos_solidos', completada: true, respuestas: { recoleccionRegular: false, puntosAcumulacion: true, reciclaje: false, residuosPeligrosos: false }, nivelRiesgo: 'alto', observaciones: 'No llega vehículo recolector. Residuos a cielo abierto.' },
      { dimension: 'vectores_plagas', completada: false, respuestas: {}, nivelRiesgo: 'sin_riesgo', observaciones: '' },
      { dimension: 'calidad_aire', completada: false, respuestas: {}, nivelRiesgo: 'sin_riesgo', observaciones: '' },
      { dimension: 'suelo_vivienda', completada: false, respuestas: {}, nivelRiesgo: 'sin_riesgo', observaciones: '' },
    ],
    riesgoGeneral: 'critico',
    recomendaciones: '',
    ...audit,
  },
]

// --- Seguimientos Ambientales ---
export const seguimientosAmbientalesSeed: SeguimientoAmbiental[] = [
  {
    id: 'sa_seg1', caracterizacionId: 'ca1', fecha: '2026-05-04', profesional: 'María López',
    observaciones: 'Se realizó jornada de fumigación con Secretaría de Medio Ambiente. Se entregaron toldillos a familias cercanas a la quebrada.',
    cambiosRiesgo: [
      { dimension: 'vectores_plagas', nuevoNivel: 'medio', nota: 'Fumigación realizada. Se requiere seguimiento en 15 días.' },
    ],
    nuevoRiesgoGeneral: 'medio',
    ...audit,
  },
]

// --- Activos Territoriales ---
export const activosSeed: ActivoTerritorial[] = [
  {
    id: 'act1', codigo: 'AT-001', nombre: 'Centro de Salud Santo Domingo', categoria: 'salud',
    comuna: '1 - Popular', barrio: 'Santo Domingo', direccion: 'Cra 33 #106-10',
    descripcion: 'Centro de atención primaria con servicios de consulta externa, vacunación y laboratorio básico.',
    responsable: 'Dr. Héctor Jaime Montoya', telefono: '3104567890', estado: 'activo',
    jornadasAsociadas: ['Jornada de Tamizaje Nutricional', 'Brigada de Vacunación Abril 2026'],
    observaciones: 'Punto de referencia para actividades de salud en la comuna 1.',
    ...audit,
  },
  {
    id: 'act2', codigo: 'AT-002', nombre: 'Parque Biblioteca España', categoria: 'cultural',
    comuna: '1 - Popular', barrio: 'Santo Domingo', direccion: 'Cra 33B #107A-100',
    descripcion: 'Espacio cultural y educativo con salón de eventos, biblioteca y aulas múltiples.',
    responsable: 'Coordinadora Luz Adriana Restrepo', telefono: '3209876543', estado: 'activo',
    jornadasAsociadas: ['Taller de Salud Mental Comunitaria'],
    observaciones: 'Disponible para actividades grupales previa reserva.',
    ...audit,
  },
  {
    id: 'act3', codigo: 'AT-003', nombre: 'Cancha La Esperanza', categoria: 'recreacion',
    comuna: '1 - Popular', barrio: 'Santo Domingo', direccion: 'Cll 107 #32-15',
    descripcion: 'Cancha múltiple con graderías y zonas verdes adyacentes.',
    responsable: 'JAC Santo Domingo', telefono: '3157654321', estado: 'activo',
    jornadasAsociadas: [],
    observaciones: 'Espacio abierto para brigadas de salud y actividades al aire libre.',
    ...audit,
  },
  {
    id: 'act4', codigo: 'AT-004', nombre: 'Mercado Campesino San Javier', categoria: 'economico',
    comuna: '13 - San Javier', barrio: 'San Javier', direccion: 'Cra 98 #45-20',
    descripcion: 'Mercado semanal con venta de productos agrícolas locales. Punto de encuentro comunitario.',
    responsable: 'Asociación de Campesinos del Occidente', telefono: '3001234567', estado: 'activo',
    jornadasAsociadas: ['Encuentro de Seguridad Alimentaria'],
    observaciones: 'Funciona los sábados de 6am a 1pm.',
    ...audit,
  },
  {
    id: 'act5', codigo: 'AT-005', nombre: 'Humedal La Herrera', categoria: 'ambiental',
    comuna: '8 - Villa Hermosa', barrio: 'Villa Hermosa', direccion: 'Cll 55 con Quebrada La Herrera',
    descripcion: 'Zona de protección ambiental con importancia para el ecosistema local.',
    responsable: 'Secretaría de Medio Ambiente', telefono: '3148765432', estado: 'en_verificacion',
    jornadasAsociadas: [],
    observaciones: 'En proceso de delimitación oficial. Zona vinculada a caracterización ambiental SA-001.',
    ...audit,
  },
]

// --- Salas Amigas ---
export const empresasSalaSeed: EmpresaSalaAmiga[] = [
  {
    id: 'sa1', codigo: 'SAL-001', nombreEmpresa: 'Confecciones El Progreso S.A.S.', nit: '900.456.789-1',
    sectorEconomico: 'Industria textil', comuna: '13 - San Javier', barrio: 'San Javier', direccion: 'Cll 45 #97-20',
    contactoNombre: 'Sandra Milena Torres', contactoCargo: 'Jefe de Talento Humano', contactoTelefono: '3001234567',
    numTrabajadores: 85, numMujeresEdadFertil: 52, estado: 'certificada', tieneSalaAmiga: true,
    observaciones: 'Sala amiga implementada desde 2025. Cumple requisitos de la norma.',
    ...audit,
  },
  {
    id: 'sa2', codigo: 'SAL-002', nombreEmpresa: 'Almacenes La 65 Ltda.', nit: '800.123.456-7',
    sectorEconomico: 'Comercio', comuna: '11 - Laureles-Estadio', barrio: 'Laureles', direccion: 'Cra 65 #48-30',
    contactoNombre: 'Carlos Andrés Mejía', contactoCargo: 'Administrador', contactoTelefono: '3209876543',
    numTrabajadores: 45, numMujeresEdadFertil: 28, estado: 'socializada', tieneSalaAmiga: false,
    observaciones: 'Socialización de norma realizada. Pendiente implementación.',
    ...audit,
  },
  {
    id: 'sa3', codigo: 'SAL-003', nombreEmpresa: 'Clínica del Norte', nit: '900.789.012-3',
    sectorEconomico: 'Salud', comuna: '7 - Robledo', barrio: 'Robledo', direccion: 'Cll 78B #69-240',
    contactoNombre: 'Diana Patricia Henao', contactoCargo: 'Directora Administrativa', contactoTelefono: '3157654321',
    numTrabajadores: 320, numMujeresEdadFertil: 180, estado: 'en_implementacion', tieneSalaAmiga: false,
    observaciones: 'En adecuación de espacio físico. Se espera tener la sala lista en junio 2026.',
    ...audit,
  },
  {
    id: 'sa4', codigo: 'SAL-004', nombreEmpresa: 'Taller Mecánico Los Paisas', nit: '70.456.789',
    sectorEconomico: 'Automotriz', comuna: '5 - Castilla', barrio: 'Castilla', direccion: 'Cra 68 #92-15',
    contactoNombre: 'Jorge Iván Restrepo', contactoCargo: 'Propietario', contactoTelefono: '3004567890',
    numTrabajadores: 12, numMujeresEdadFertil: 2, estado: 'no_aplica', tieneSalaAmiga: false,
    observaciones: 'Empresa con menos de 5 mujeres en edad fértil. No aplica según norma.',
    ...audit,
  },
]

export const socializacionesSeed: SocializacionNorma[] = [
  {
    id: 'soc1', empresaId: 'sa1', fecha: '2025-06-15', profesional: 'Ana Martínez',
    temasTratados: ['Ley 1823 de 2017', 'Beneficios de la lactancia materna', 'Requisitos de la sala amiga', 'Plan de implementación'],
    asistentes: 12, compromisos: 'La empresa se compromete a adecuar un espacio y asignar presupuesto.',
    observaciones: 'Buena receptividad por parte de directivos.',
    ...audit,
  },
  {
    id: 'soc2', empresaId: 'sa2', fecha: '2026-04-10', profesional: 'Ana Martínez',
    temasTratados: ['Ley 1823 de 2017', 'Derechos de las madres lactantes', 'Requisitos mínimos'],
    asistentes: 8, compromisos: 'Pendiente definir espacio y fecha de implementación.',
    observaciones: 'El administrador solicitó más información sobre costos.',
    ...audit,
  },
  {
    id: 'soc3', empresaId: 'sa3', fecha: '2026-03-20', profesional: 'Jorge Restrepo',
    temasTratados: ['Ley 1823 de 2017', 'Normatividad sector salud', 'Diseño del espacio', 'Dotación requerida'],
    asistentes: 15, compromisos: 'La clínica asigna presupuesto y espacio en piso 2. Fecha estimada: junio 2026.',
    observaciones: 'Alta motivación del equipo directivo.',
    ...audit,
  },
]

export const seguimientosSalaSeed: SeguimientoSalaAmiga[] = [
  {
    id: 'ss1', empresaId: 'sa1', fecha: '2026-04-05', profesional: 'Ana Martínez',
    tipoVisita: 'verificacion', cumpleRequisitos: true,
    hallazgos: 'Sala en buen estado. Refrigerador funcionando. Silla cómoda. Privacidad garantizada. Horario de uso publicado.',
    recomendaciones: 'Mantener insumos de aseo. Actualizar cartelera informativa.',
    proximaVisita: '2026-07-05',
    ...audit,
  },
  {
    id: 'ss2', empresaId: 'sa3', fecha: '2026-05-02', profesional: 'Jorge Restrepo',
    tipoVisita: 'asesoria', cumpleRequisitos: false,
    hallazgos: 'Espacio seleccionado pero sin adecuación. Falta refrigerador y lavamanos.',
    recomendaciones: 'Instalar lavamanos, adquirir refrigerador, señalizar el espacio.',
    proximaVisita: '2026-06-01',
    ...audit,
  },
]

// --- Formularios Dinámicos ---
export const formulariosSeed: FormularioDinamico[] = [
  {
    id: 'fd1', codigo: 'FD-001', nombre: 'Tamizaje Visual Infantil', version: '1.0',
    descripcion: 'Formulario de tamizaje visual para niños entre 3 y 12 años. Detecta alteraciones visuales tempranas.',
    dimension: 'vida_saludable', aplicaA: ['ninos'],
    estado: 'activo', creadoEn: '2026-01-15', actualizadoEn: '2026-03-01',
    secciones: [
      {
        id: 's1', titulo: 'Datos del tamizaje', campos: [
          { id: 'fecha_tamizaje', label: 'Fecha del tamizaje', tipo: 'date', requerido: true },
          { id: 'profesional', label: 'Profesional que realiza', tipo: 'text', requerido: true },
          { id: 'lugar', label: 'Lugar', tipo: 'text', requerido: true, placeholder: 'Institución o entorno' },
        ],
      },
      {
        id: 's2', titulo: 'Evaluación visual', descripcion: 'Aplicar carta de Snellen a 3 metros', campos: [
          { id: 'agudeza_od', label: 'Agudeza visual ojo derecho', tipo: 'select', requerido: true, opciones: ['20/20', '20/30', '20/40', '20/50', '20/70', '20/100', '20/200', 'No coopera'] },
          { id: 'agudeza_oi', label: 'Agudeza visual ojo izquierdo', tipo: 'select', requerido: true, opciones: ['20/20', '20/30', '20/40', '20/50', '20/70', '20/100', '20/200', 'No coopera'] },
          { id: 'usa_lentes', label: '¿Usa lentes actualmente?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No'] },
          { id: 'refiere_dificultad', label: '¿Refiere dificultad para ver?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No'] },
          { id: 'dolor_cabeza', label: '¿Presenta cefalea frecuente?', tipo: 'radio', requerido: false, opciones: ['Sí', 'No'] },
        ],
      },
      {
        id: 's3', titulo: 'Resultado y conducta', campos: [
          { id: 'resultado', label: 'Resultado del tamizaje', tipo: 'select', requerido: true, opciones: ['Normal', 'Alterado - Leve', 'Alterado - Moderado', 'Alterado - Severo'] },
          { id: 'requiere_remision', label: '¿Requiere remisión a optometría?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No'] },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', requerido: false, placeholder: 'Notas adicionales del tamizaje...' },
        ],
      },
    ],
  },
  {
    id: 'fd2', codigo: 'FD-002', nombre: 'Valoración Nutricional', version: '2.1',
    descripcion: 'Formulario de valoración del estado nutricional. Incluye antropometría y hábitos alimentarios.',
    dimension: 'vida_saludable', aplicaA: ['ninos', 'adolescentes', 'adultos', 'gestantes', 'adulto_mayor'],
    estado: 'activo', creadoEn: '2026-01-10', actualizadoEn: '2026-04-15',
    secciones: [
      {
        id: 's1', titulo: 'Antropometría', campos: [
          { id: 'peso', label: 'Peso (kg)', tipo: 'number', requerido: true, placeholder: 'Ej: 65.5' },
          { id: 'talla', label: 'Talla (cm)', tipo: 'number', requerido: true, placeholder: 'Ej: 170' },
          { id: 'perimetro_brazo', label: 'Perímetro braquial (cm)', tipo: 'number', requerido: false },
          { id: 'imc_calculado', label: 'IMC calculado', tipo: 'text', requerido: false, ayuda: 'Se calcula automáticamente en producción' },
        ],
      },
      {
        id: 's2', titulo: 'Hábitos alimentarios', campos: [
          { id: 'comidas_dia', label: 'Número de comidas al día', tipo: 'select', requerido: true, opciones: ['1', '2', '3', '4', '5 o más'] },
          { id: 'consume_frutas', label: '¿Consume frutas diariamente?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No', 'A veces'] },
          { id: 'consume_verduras', label: '¿Consume verduras diariamente?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No', 'A veces'] },
          { id: 'consume_lacteos', label: '¿Consume lácteos diariamente?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No', 'A veces'] },
          { id: 'acceso_agua', label: '¿Tiene acceso a agua potable?', tipo: 'radio', requerido: true, opciones: ['Sí', 'No'] },
          { id: 'alergias', label: 'Alergias alimentarias', tipo: 'textarea', requerido: false },
        ],
      },
      {
        id: 's3', titulo: 'Clasificación nutricional', campos: [
          { id: 'clasificacion', label: 'Clasificación', tipo: 'select', requerido: true, opciones: ['Adecuado', 'Riesgo de desnutrición', 'Desnutrición aguda', 'Desnutrición crónica', 'Sobrepeso', 'Obesidad'] },
          { id: 'conducta', label: 'Conducta', tipo: 'select', requerido: true, opciones: ['Consejería nutricional', 'Remisión a nutrición', 'Remisión a programa de recuperación', 'Control en 3 meses'] },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', requerido: false },
        ],
      },
    ],
  },
  {
    id: 'fd3', codigo: 'FD-003', nombre: 'Escala de Ansiedad y Depresión (PHQ-4)', version: '1.0',
    descripcion: 'Cuestionario breve de tamizaje para ansiedad y depresión. 4 preguntas con escala Likert.',
    dimension: 'salud_mental', aplicaA: ['adolescentes', 'adultos', 'adulto_mayor'],
    estado: 'activo', creadoEn: '2026-02-01', actualizadoEn: '2026-02-01',
    secciones: [
      {
        id: 's1', titulo: 'En las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?',
        descripcion: '0=Nunca, 1=Varios días, 2=Más de la mitad de los días, 3=Casi todos los días',
        campos: [
          { id: 'nervioso', label: 'Sentirse nervioso/a, ansioso/a o con los nervios de punta', tipo: 'select', requerido: true, opciones: ['0 - Nunca', '1 - Varios días', '2 - Más de la mitad', '3 - Casi todos los días'] },
          { id: 'no_controlar', label: 'No poder dejar de preocuparse o no controlar la preocupación', tipo: 'select', requerido: true, opciones: ['0 - Nunca', '1 - Varios días', '2 - Más de la mitad', '3 - Casi todos los días'] },
          { id: 'poco_interes', label: 'Poco interés o placer en hacer las cosas', tipo: 'select', requerido: true, opciones: ['0 - Nunca', '1 - Varios días', '2 - Más de la mitad', '3 - Casi todos los días'] },
          { id: 'deprimido', label: 'Sentirse decaído/a, deprimido/a o sin esperanza', tipo: 'select', requerido: true, opciones: ['0 - Nunca', '1 - Varios días', '2 - Más de la mitad', '3 - Casi todos los días'] },
        ],
      },
      {
        id: 's2', titulo: 'Resultado', campos: [
          { id: 'puntaje_total', label: 'Puntaje total (0-12)', tipo: 'number', requerido: true, ayuda: '0-2: Normal, 3-5: Leve, 6-8: Moderado, 9-12: Severo' },
          { id: 'clasificacion', label: 'Clasificación', tipo: 'select', requerido: true, opciones: ['Normal (0-2)', 'Leve (3-5)', 'Moderado (6-8)', 'Severo (9-12)'] },
          { id: 'conducta', label: 'Conducta', tipo: 'select', requerido: true, opciones: ['Sin intervención', 'Consejería breve', 'Remisión a psicología', 'Remisión urgente a psiquiatría'] },
          { id: 'observaciones', label: 'Observaciones', tipo: 'textarea', requerido: false },
        ],
      },
    ],
  },
]

export const respuestasFormularioSeed: RespuestaFormulario[] = [
  {
    id: 'rf1', formularioId: 'fd1', personaId: 'p3', visitaId: 'v1',
    respuestas: {
      fecha_tamizaje: '2026-04-28', profesional: 'Ana Martínez', lugar: 'Centro Comunitario La Esperanza',
      agudeza_od: '20/30', agudeza_oi: '20/40', usa_lentes: 'No', refiere_dificultad: 'Sí',
      resultado: 'Alterado - Leve', requiere_remision: 'Sí', observaciones: 'Niña refiere dificultad para ver el tablero.',
    },
    completado: true, fecha: '2026-04-28',
    ...audit,
  },
  {
    id: 'rf2', formularioId: 'fd2', personaId: 'p7', visitaId: 'v5',
    respuestas: {
      peso: 14, talla: 98, comidas_dia: '3', consume_frutas: 'A veces', consume_verduras: 'No',
      consume_lacteos: 'Sí', acceso_agua: 'Sí',
      clasificacion: 'Riesgo de desnutrición', conducta: 'Remisión a nutrición',
    },
    completado: true, fecha: '2026-05-03',
    ...audit,
  },
]

// --- Eventos de calendario ---
export const eventosSeed: EventoCalendario[] = [
  { id: 'ev1', titulo: 'Visita Comunitaria La Esperanza', tipo: 'visita', fecha: '2026-05-10', horaInicio: '08:00', horaFin: '12:00', profesional: 'Ana Martínez', lugar: 'Centro Comunitario La Esperanza', descripcion: 'Jornada de tamizaje nutricional', color: '#3b82f6' },
  { id: 'ev2', titulo: 'Taller Salud Mental', tipo: 'actividad', fecha: '2026-05-12', horaInicio: '14:00', horaFin: '17:00', profesional: 'Jorge Restrepo', lugar: 'Salón Comunal Manrique', descripcion: 'Taller grupal manejo del estrés', color: '#8b5cf6' },
  { id: 'ev3', titulo: 'Reunión equipo PYMS', tipo: 'reunion', fecha: '2026-05-13', horaInicio: '09:00', horaFin: '10:30', profesional: 'Carlos Gómez', lugar: 'Oficina Secretaría de Salud', descripcion: 'Revisión mensual de indicadores', color: '#6b7280' },
  { id: 'ev4', titulo: 'Capacitación formularios', tipo: 'capacitacion', fecha: '2026-05-14', horaInicio: '08:00', horaFin: '12:00', profesional: 'María López', lugar: 'Sala de reuniones piso 3', descripcion: 'Capacitación sobre nuevos formularios dinámicos', color: '#f59e0b' },
  { id: 'ev5', titulo: 'Brigada Salud Oral', tipo: 'jornada', fecha: '2026-05-15', horaInicio: '08:00', horaFin: '16:00', profesional: 'Jorge Restrepo', lugar: 'Parque Recreativo San Javier', descripcion: 'Brigada con aplicación de flúor', color: '#10b981' },
  { id: 'ev6', titulo: 'Caracterización Hogar sector 3', tipo: 'visita', fecha: '2026-05-16', horaInicio: '08:00', horaFin: '12:00', profesional: 'Ana Martínez', lugar: 'Barrio Santo Domingo', descripcion: 'Caracterización de hogares nuevos', color: '#3b82f6' },
  { id: 'ev7', titulo: 'Visita Entorno Educativo', tipo: 'visita', fecha: '2026-05-19', horaInicio: '07:30', horaFin: '11:30', profesional: 'Ana Martínez', lugar: 'I.E. Félix de Bedout', descripcion: 'Charla derechos sexuales 10° grado', color: '#3b82f6' },
  { id: 'ev8', titulo: 'Seguimiento canalizaciones', tipo: 'otro', fecha: '2026-05-20', horaInicio: '14:00', horaFin: '16:00', profesional: 'Jorge Restrepo', lugar: 'Oficina', descripcion: 'Revisión de canalizaciones pendientes', color: '#ef4444' },
  { id: 'ev9', titulo: 'Encuentro Seguridad Alimentaria', tipo: 'actividad', fecha: '2026-05-20', horaInicio: '09:00', horaFin: '13:00', profesional: 'Ana Martínez', lugar: 'Sede Social Villa Hermosa', descripcion: 'Encuentro huertas caseras', color: '#8b5cf6' },
  { id: 'ev10', titulo: 'Verificación Sala Amiga', tipo: 'visita', fecha: '2026-05-22', horaInicio: '10:00', horaFin: '11:30', profesional: 'Ana Martínez', lugar: 'Confecciones El Progreso', descripcion: 'Verificación semestral sala amiga', color: '#3b82f6' },
  { id: 'ev11', titulo: 'Jornada vacunación', tipo: 'jornada', fecha: '2026-05-23', horaInicio: '08:00', horaFin: '16:00', profesional: 'María López', lugar: 'Centro de Salud Santo Domingo', descripcion: 'Jornada de vacunación PAI', color: '#10b981' },
  { id: 'ev12', titulo: 'Comité técnico mensual', tipo: 'reunion', fecha: '2026-05-27', horaInicio: '14:00', horaFin: '16:00', profesional: 'Carlos Gómez', lugar: 'Oficina Secretaría de Salud', descripcion: 'Comité técnico con supervisores', color: '#6b7280' },
]
