import IModel from '../interfaces/IModel';
import IService from '../interfaces/IService';
import ValidateEntry from 'src/helpers/ValidateEntry';
import { ISystem, systemZodSchema } from '../interfaces/ISystem';

class SystemServices extends ValidateEntry implements IService<ISystem> {
  constructor (private readonly _model: IModel<ISystem>) {
    super();
  }

  public async create (payload: ISystem): Promise<ISystem> {
    this.validate(systemZodSchema, payload);
    const newSystem: ISystem = await this._model.create(payload);
    return newSystem;
  }

  public async findAll (): Promise<ISystem[]> {
    throw new Error('Method not implemented');
  }

  public async findOne (_id: string): Promise<ISystem> {
    throw new Error('Method not implemented');
  }

  public async update (_id: string, payload: ISystem): Promise<ISystem> {
    throw new Error('Method not implemented');
  }

  public async delete (_id: string): Promise<null> {
    throw new Error('Method not implemented.');
  }
}

export default SystemServices;
