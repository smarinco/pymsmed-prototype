import type { TipoEntorno } from './entorno-config'

const audit = {
  creadoPor: 'sistema', creadoEn: '2026-05-04T10:00:00',
  actualizadoPor: 'sistema', actualizadoEn: '2026-05-04T10:00:00',
}

export interface EntornoGenerico {
  id: string
  codigo: string
  estado: 'activo' | 'inactivo'
  motivoInactivacion?: string
  creadoPor: string
  creadoEn: string
  actualizadoPor: string
  actualizadoEn: string
  [key: string]: unknown
}

export const seedEducativos: EntornoGenerico[] = [
  { id: 'ee1', codigo: 'EE-001', nombre: 'I.E. Félix de Bedout Moreno', tipoInstitucion: 'basica_secundaria', nombreInstitucion: 'I.E. Félix de Bedout Moreno', sede: 'Sede principal', jornada: 'manana', comuna: '4 - Aranjuez', barrio: 'Aranjuez', direccion: 'Cra 51 #72-35', responsable: 'Rector Juan Pablo Henao', telefono: '3104567890', poblacionAprox: '850 estudiantes', observaciones: 'Institución priorizada para tamizaje visual.', estado: 'activo', ...audit },
  { id: 'ee2', codigo: 'EE-002', nombre: 'Centro Educativo La Candelaria', tipoInstitucion: 'basica_primaria', nombreInstitucion: 'C.E. La Candelaria', sede: 'Única', jornada: 'completa', comuna: '10 - La Candelaria', barrio: 'La Candelaria', direccion: 'Cll 52 #43-12', responsable: 'Directora Luz Marina Castro', telefono: '3209871234', poblacionAprox: '320 estudiantes', observaciones: '', estado: 'activo', ...audit },
  { id: 'ee3', codigo: 'EE-003', nombre: 'Jardín Infantil Semillitas', tipoInstitucion: 'preescolar', nombreInstitucion: 'Jardín Infantil Semillitas', sede: 'Única', jornada: 'manana', comuna: '1 - Popular', barrio: 'Santo Domingo', direccion: 'Cra 33 #108-05', responsable: 'Sandra Milena Ríos', telefono: '3157654321', poblacionAprox: '60 niños', observaciones: 'Atención a primera infancia.', estado: 'activo', ...audit },
]

export const seedLaborales: EntornoGenerico[] = [
  { id: 'el1', codigo: 'EL-001', nombre: 'Confecciones El Progreso', tipoEmpresa: 'formal', nombreEmpresa: 'Confecciones El Progreso S.A.S.', nit: '900.456.789-1', sectorEconomico: 'industria', comuna: '13 - San Javier', barrio: 'San Javier', direccion: 'Cll 45 #97-20', responsable: 'Gerente Pedro Gómez', telefono: '3001234567', numTrabajadores: '85', observaciones: 'Empresa textil con programa de SST.', estado: 'activo', ...audit },
  { id: 'el2', codigo: 'EL-002', nombre: 'Plaza de Mercado Minorista', tipoEmpresa: 'informal', nombreEmpresa: 'Plaza Minorista José María Villa', nit: '', sectorEconomico: 'comercio', comuna: '10 - La Candelaria', barrio: 'Guayaquil', direccion: 'Cra 57 #55-12', responsable: 'Administrador Luis Fernando Zapata', telefono: '3209876543', numTrabajadores: '200+', observaciones: 'Población informal, jornadas de salud periódicas.', estado: 'activo', ...audit },
]

export const seedInstitucionales: EntornoGenerico[] = [
  { id: 'ei1', codigo: 'EI-001', nombre: 'Hogar Geriátrico San José', tipoInstitucion: 'adulto_mayor', nombreInstitucion: 'Hogar Geriátrico San José', comuna: '9 - Buenos Aires', barrio: 'Buenos Aires', direccion: 'Cra 35 #48-15', responsable: 'Directora Martha Elena Correa', telefono: '3148765432', capacidad: '45 personas', poblacionAtendida: 'Adultos mayores de 60 años', observaciones: 'Institución con convenio para atención integral.', estado: 'activo', ...audit },
  { id: 'ei2', codigo: 'EI-002', nombre: 'Centro de Protección Renacer', tipoInstitucion: 'proteccion', nombreInstitucion: 'Fundación Renacer', comuna: '8 - Villa Hermosa', barrio: 'Villa Hermosa', direccion: 'Cll 54 #30-08', responsable: 'Director Carlos Andrés Mejía', telefono: '3006543210', capacidad: '80 personas', poblacionAtendida: 'Niños y adolescentes en protección', observaciones: 'Operado por ICBF.', estado: 'activo', ...audit },
  { id: 'ei3', codigo: 'EI-003', nombre: 'Centro Día Belén', tipoInstitucion: 'adulto_mayor', nombreInstitucion: 'Centro Día Alcaldía de Medellín', comuna: '16 - Belén', barrio: 'Belén', direccion: 'Cll 30 #76-40', responsable: 'Coordinadora Ana Lucía Patiño', telefono: '3112345678', capacidad: '60 personas', poblacionAtendida: 'Adultos mayores ambulatorios', observaciones: '', estado: 'inactivo', motivoInactivacion: 'En remodelación hasta julio 2026.', ...audit },
]

export function getSeedByTipo(tipo: TipoEntorno): EntornoGenerico[] {
  switch (tipo) {
    case 'educativo': return seedEducativos
    case 'laboral': return seedLaborales
    case 'institucional': return seedInstitucionales
  }
}
