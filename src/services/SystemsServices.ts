import SystemsModel from 'src/database/models/SystemsModel';
import IService from 'src/types/IService';
import systemZodSchema, { ISystem, ISystemContent } from 'src/schemas/systemsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import updateContentZodSchema, { IUpdateContent } from 'src/schemas/updateContentSchema';

export default class SystemsServices
  extends ValidateEntry
  implements IService<ISystem> {
  constructor(private readonly _model: SystemsModel) {
    super();
  }

  public async findAll(): Promise<ISystem[]> {
    const response = await this._model.findAll();
    return response;
  };

  public async findOne(_id: string): Promise<ISystem> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('Not found a system with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async update(_id: string, payload: ISystem): Promise<ISystem> {
    this.validate(systemZodSchema, payload);

    if (payload.content) {
      const err = new Error('Update the content directly is not allowed');
      err.stack = HttpStatusCode.FORBIDDEN.toString();
      err.name = 'ForbiddenRequest'

      throw err;
    }

    const response = await this._model.update(_id, payload);

    if (!response) {
      const err = new Error('Not found a system with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async updateContent(_id: string, entityQuery: string, payload: IUpdateContent): Promise<string> {
    this.validate(updateContentZodSchema, payload);

    if (!entityQuery) {
      const err = new Error('An entity name is required');
      err.stack = HttpStatusCode.UNPROCESSABLE_ENTITY.toString();
      err.name = 'ValidationError';

      throw err;
    }

    const { method, newID } = payload;

    const recoverSystem = await this._model.findOne(_id);

    if (!recoverSystem) {
      const err = new Error('Not found a system with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound';

      throw err;
    }

    if (method === 'add') {
      recoverSystem.content[entityQuery as keyof ISystemContent].push(newID);
    };

    if (method === 'remove') {
      const removeIdFromContent = recoverSystem.content[entityQuery as keyof ISystemContent]
        .filter((id) => id !== newID);

      recoverSystem.content[entityQuery as keyof ISystemContent] = removeIdFromContent;
    }

    await this._model.update(_id, recoverSystem);

    const response = `New ID ${newID} was ${method} to array of entities ${entityQuery}`;

    return response;
  };

  public async delete(_id: string): Promise<void> {
    throw new Error('Method not implemented yet');
  }
}
