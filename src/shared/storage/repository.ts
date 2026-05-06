// ============================================
// Interfaz genérica de repositorio
// TODO-API: Reemplazar LocalStorageRepository por ApiRepository
// ============================================

export interface Repository<T, CreateInput, UpdateInput> {
  list(): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(input: CreateInput): Promise<T>
  update(id: string, input: UpdateInput): Promise<T>
  delete(id: string): Promise<void>
}

export class LocalStorageRepository<T extends { id: string }, CreateInput, UpdateInput>
  implements Repository<T, CreateInput, UpdateInput>
{
  constructor(
    private storageKey: string,
    private buildEntity: (input: CreateInput) => T,
    private applyUpdate: (entity: T, input: UpdateInput) => T,
  ) {}

  private getAll(): T[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private saveAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  async list(): Promise<T[]> {
    return this.getAll()
  }

  async getById(id: string): Promise<T | null> {
    return this.getAll().find((item) => item.id === id) ?? null
  }

  async create(input: CreateInput): Promise<T> {
    const items = this.getAll()
    const entity = this.buildEntity(input)
    items.push(entity)
    this.saveAll(items)
    return entity
  }

  async update(id: string, input: UpdateInput): Promise<T> {
    const items = this.getAll()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error(`Entidad ${id} no encontrada`)
    items[index] = this.applyUpdate(items[index], input)
    this.saveAll(items)
    return items[index]
  }

  async delete(id: string): Promise<void> {
    const items = this.getAll().filter((item) => item.id !== id)
    this.saveAll(items)
  }

  /** Carga datos semilla solo si el storage está vacío */
  seedIfEmpty(seeds: T[]): void {
    if (this.getAll().length === 0) {
      this.saveAll(seeds)
    }
  }

  /** Fuerza recarga de datos semilla */
  forceReseed(seeds: T[]): void {
    this.saveAll(seeds)
  }
}
