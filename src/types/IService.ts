export default interface IService<T> {
  create?: (payload: T) => Promise<T>
  findAll: () => Promise<T[]>
  findAllByEntity?: (_id: string, query: string) => Promise<T[]>
  findOne: (_id: string) => Promise<T | null>
  update: (_id: string, payload: T) => Promise<T | null>
  delete: (_id: string) => Promise<void>
}
