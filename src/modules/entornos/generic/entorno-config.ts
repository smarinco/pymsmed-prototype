// Configuración de campos específicos por tipo de entorno
// Permite reutilizar listado, ficha y formulario genéricos

export type TipoEntorno = 'educativo' | 'laboral' | 'institucional'

export interface CampoEntorno {
  key: string
  label: string
  type: 'text' | 'select' | 'textarea'
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

export interface EntornoConfig {
  tipo: TipoEntorno
  label: string
  labelPlural: string
  storageKey: string
  codigoPrefix: string
  campos: CampoEntorno[]
}

const camposComunes: CampoEntorno[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Nombre del entorno' },
  { key: 'comuna', label: 'Comuna', type: 'select', required: true, options: [
    '1 - Popular', '2 - Santa Cruz', '3 - Manrique', '4 - Aranjuez',
    '5 - Castilla', '6 - Doce de Octubre', '7 - Robledo', '8 - Villa Hermosa',
    '9 - Buenos Aires', '10 - La Candelaria', '11 - Laureles-Estadio',
    '12 - La América', '13 - San Javier', '14 - El Poblado', '15 - Guayabal', '16 - Belén',
  ].map((c) => ({ value: c, label: c })) },
  { key: 'barrio', label: 'Barrio', type: 'text', required: true },
  { key: 'direccion', label: 'Dirección', type: 'text', required: true },
  { key: 'telefono', label: 'Teléfono de contacto', type: 'text' },
  { key: 'responsable', label: 'Responsable / Referente', type: 'text', required: true },
]

export const entornoConfigs: Record<TipoEntorno, EntornoConfig> = {
  educativo: {
    tipo: 'educativo',
    label: 'Entorno Educativo',
    labelPlural: 'Entornos Educativos',
    storageKey: 'pyms_entornos_educativos',
    codigoPrefix: 'EE',
    campos: [
      ...camposComunes,
      { key: 'tipoInstitucion', label: 'Tipo de institución', type: 'select', required: true, options: [
        { value: 'preescolar', label: 'Preescolar' },
        { value: 'basica_primaria', label: 'Básica Primaria' },
        { value: 'basica_secundaria', label: 'Básica Secundaria' },
        { value: 'media', label: 'Media' },
        { value: 'tecnica', label: 'Técnica' },
        { value: 'universitaria', label: 'Universitaria' },
        { value: 'otro', label: 'Otro' },
      ]},
      { key: 'nombreInstitucion', label: 'Nombre de la institución', type: 'text', required: true, placeholder: 'Ej: I.E. Félix de Bedout' },
      { key: 'sede', label: 'Sede', type: 'text', placeholder: 'Ej: Sede principal' },
      { key: 'jornada', label: 'Jornada', type: 'select', options: [
        { value: 'manana', label: 'Mañana' }, { value: 'tarde', label: 'Tarde' },
        { value: 'completa', label: 'Completa' }, { value: 'nocturna', label: 'Nocturna' },
      ]},
      { key: 'poblacionAprox', label: 'Población aproximada', type: 'text', placeholder: 'Ej: 450 estudiantes' },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
    ],
  },
  laboral: {
    tipo: 'laboral',
    label: 'Entorno Laboral',
    labelPlural: 'Entornos Laborales',
    storageKey: 'pyms_entornos_laborales',
    codigoPrefix: 'EL',
    campos: [
      ...camposComunes,
      { key: 'tipoEmpresa', label: 'Tipo de empresa', type: 'select', required: true, options: [
        { value: 'formal', label: 'Formal' },
        { value: 'informal', label: 'Informal' },
        { value: 'cooperativa', label: 'Cooperativa' },
        { value: 'publica', label: 'Pública' },
        { value: 'otro', label: 'Otro' },
      ]},
      { key: 'nombreEmpresa', label: 'Nombre de la empresa', type: 'text', required: true },
      { key: 'nit', label: 'NIT', type: 'text', placeholder: 'Ej: 900.123.456-7' },
      { key: 'sectorEconomico', label: 'Sector económico', type: 'select', options: [
        { value: 'comercio', label: 'Comercio' }, { value: 'servicios', label: 'Servicios' },
        { value: 'industria', label: 'Industria' }, { value: 'construccion', label: 'Construcción' },
        { value: 'agropecuario', label: 'Agropecuario' }, { value: 'otro', label: 'Otro' },
      ]},
      { key: 'numTrabajadores', label: 'Número de trabajadores', type: 'text' },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
    ],
  },
  institucional: {
    tipo: 'institucional',
    label: 'Entorno Institucional',
    labelPlural: 'Entornos Institucionales',
    storageKey: 'pyms_entornos_institucionales',
    codigoPrefix: 'EI',
    campos: [
      ...camposComunes,
      { key: 'tipoInstitucion', label: 'Tipo de institución', type: 'select', required: true, options: [
        { value: 'salud', label: 'Institución de Salud' },
        { value: 'proteccion', label: 'Centro de Protección' },
        { value: 'reclusion', label: 'Centro de Reclusión' },
        { value: 'adulto_mayor', label: 'Centro de Adulto Mayor' },
        { value: 'discapacidad', label: 'Centro de Discapacidad' },
        { value: 'otro', label: 'Otro' },
      ]},
      { key: 'nombreInstitucion', label: 'Nombre de la institución', type: 'text', required: true },
      { key: 'capacidad', label: 'Capacidad', type: 'text', placeholder: 'Ej: 120 personas' },
      { key: 'poblacionAtendida', label: 'Población atendida', type: 'text', placeholder: 'Ej: Adultos mayores' },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
    ],
  },
}
