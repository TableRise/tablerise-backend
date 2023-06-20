import SystemsModel from 'src/database/models/SystemsModel';
import IService from 'src/types/IService';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class SystemsServices
  extends ValidateEntry
  implements IService<ISystem> {
  constructor(readonly _model: SystemsModel) {
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
      err.name = 'Not Found'
    }

    return response as ISystem;
  }

  public async update(_id: string, payload: ISystem): Promise<ISystem> {
    throw new Error('Method not implemented yet');
  }

  public async delete(_id: string): Promise<void> {
    throw new Error('Method not implemented yet');
  }
}
