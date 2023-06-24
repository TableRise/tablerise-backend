import { IUpdateContent } from 'src/schemas/updateContentSchema';
export default interface IService<T> {
  create?: (payload: T) => Promise<T>
  findAll: () => Promise<T[]>
  findOne: (_id: string) => Promise<T | null>
  update: (_id: string, payload: T) => Promise<T | null>
  updateContent?: (_id: string, entityQuery: string, payload: IUpdateContent) => Promise<string>
  delete: (_id: string) => Promise<void>
}
