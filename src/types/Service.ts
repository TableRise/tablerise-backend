import { UpdateContent } from 'src/schemas/updateContentSchema';
export default interface Service<T> {
  create?: (payload: T) => Promise<T>
  findAll: () => Promise<T[]>
  findOne: (_id: string) => Promise<T | null>
  update: (_id: string, payload: T) => Promise<T | null>
  updateContent?: (_id: string, entityQuery: string, payload: UpdateContent) => Promise<string>
  activate?: (_id: string) => Promise<string>
  deactivate?: (_id: string) => Promise<string>
}
