import { Request, Response } from 'express';
import { ISystem } from 'src/interfaces/ISystem';
import SystemServices from 'src/services/SystemServices';
import HttpStatusCode from 'src/helpers/HttpStatusCode';

class SystemControllers {
  constructor (private readonly _service: SystemServices) {
    this.create = this.create.bind(this)
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const payload: ISystem = req.body;

    const response = await this._service.create(payload);
    return res.status(HttpStatusCode.CREATED).json(response);
  }
}

export default SystemControllers;
