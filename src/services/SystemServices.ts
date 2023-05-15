import IModel from "../interfaces/IModel";
import IService from "../interfaces/IService";
import { ISystem, systemZodSchema } from "../interfaces/ISystem";
import HttpStatusCode from "../helpers/HttpStatusCode";

class SystemServices implements IService<ISystem> {
    constructor(private _model: IModel<ISystem>) {}
  
    public async create(payload: ISystem): Promise<ISystem> {
      const validate = systemZodSchema.safeParse(payload);

      if (!validate.success) {
        const newError = new Error(validate.error.message);
        newError.name = 'PAYLOAD_ERROR';
        newError.stack = `${HttpStatusCode.UNPROCESSABLE_ENTITY}`;
      }

      const newSystem: ISystem = await this._model.create(payload);
      return newSystem;
    }

    public async findAll(): Promise<ISystem[]> {
      throw new Error('Method not implemented');
    }

    public async findOne(_id: string): Promise<ISystem> {
      throw new Error('Method not implemented');
    }

    public async update(_id: string, payload: ISystem): Promise<ISystem> {
        throw new Error('Method not implemented');
    }

    public async delete(_id: string): Promise<null> {
      throw new Error("Method not implemented.");
    }
}

export default SystemServices;
