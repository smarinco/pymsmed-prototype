// ============================================
// TODO-API: Implementar cuando el backend AdonisJS esté disponible.
// Este archivo contiene adaptadores vacíos que reemplazarán
// a LocalStorageRepository para consumir la API REST real.
// ============================================

import type { Repository } from './repository'

// TODO-BACKEND: Configurar baseURL desde variable de entorno
const API_BASE = '/api/v1'

/**
 * Repositorio genérico que consume API REST.
 * Reemplaza a LocalStorageRepository sin cambiar las pantallas.
 *
 * Uso futuro:
 *   const entornoRepo = new ApiRepository<EntornoComunitario, CreateEntornoInput, UpdateEntornoInput>('/entornos/comunitario')
 */
export class ApiRepository<T extends { id: string }, CreateInput, UpdateInput>
  implements Repository<T, CreateInput, UpdateInput>
{
  private endpoint: string

  constructor(path: string) {
    this.endpoint = `${API_BASE}${path}`
  }

  // TODO-BACKEND: Implementar con fetch/axios + manejo de errores HTTP
  async list(): Promise<T[]> {
    throw new Error(`TODO-API: GET ${this.endpoint} no implementado`)
  }

  async getById(id: string): Promise<T | null> {
    throw new Error(`TODO-API: GET ${this.endpoint}/${id} no implementado`)
  }

  async create(input: CreateInput): Promise<T> {
    throw new Error(`TODO-API: POST ${this.endpoint} no implementado`)
  }

  async update(id: string, input: UpdateInput): Promise<T> {
    throw new Error(`TODO-API: PUT ${this.endpoint}/${id} no implementado`)
  }

  async delete(id: string): Promise<void> {
    throw new Error(`TODO-API: DELETE ${this.endpoint}/${id} no implementado`)
  }
}

// ============================================
// Endpoints futuros necesarios
// ============================================
// TODO-BACKEND: POST   /api/v1/auth/me                          → validar sesión SIISMED
// TODO-BACKEND: GET    /api/v1/entornos/comunitario              → listar entornos
// TODO-BACKEND: POST   /api/v1/entornos/comunitario              → crear entorno
// TODO-BACKEND: GET    /api/v1/entornos/comunitario/:id          → detalle entorno
// TODO-BACKEND: PUT    /api/v1/entornos/comunitario/:id          → actualizar entorno
// TODO-BACKEND: PATCH  /api/v1/entornos/comunitario/:id/inactivar → inactivar entorno
// TODO-BACKEND: GET    /api/v1/visitas?entornoId=:id             → visitas por entorno
// TODO-BACKEND: POST   /api/v1/visitas                           → crear visita
// TODO-BACKEND: GET    /api/v1/visitas/:id                       → detalle visita
// TODO-BACKEND: PATCH  /api/v1/visitas/:id/cerrar                → cerrar visita
// TODO-BACKEND: GET    /api/v1/visitas/:id/participantes         → participantes de visita
// TODO-BACKEND: POST   /api/v1/visitas/:id/participantes         → agregar participante
// TODO-SIISMED: GET    /api/v1/personas?documento=:doc           → buscar persona (Personas Salud)
// TODO-BACKEND: POST   /api/v1/personas                          → crear persona mock
// TODO-BACKEND: POST   /api/v1/atenciones                        → crear atención
// TODO-BACKEND: PATCH  /api/v1/atenciones/:id/finalizar          → finalizar atención
// TODO-BACKEND: GET    /api/v1/solicitudes                       → listar solicitudes
// TODO-BACKEND: POST   /api/v1/solicitudes                       → crear solicitud
// TODO-BACKEND: PATCH  /api/v1/solicitudes/:id/resolver          → aprobar/rechazar solicitud
