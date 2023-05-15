import { Request, Response } from 'express';
import { ISystem } from '../interfaces/ISystem';
import SystemServices from '../services/SystemServices';
import HttpStatusCode from '../helpers/HttpStatusCode';

class SystemControllers {
  constructor(private _service: SystemServices) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const payload: ISystem = req.body;

    const response = this._service.create(payload);
    return res.status(HttpStatusCode.CREATED).json(response);
  }
}

export default SystemControllers;
