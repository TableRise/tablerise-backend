import { Request, Response, NextFunction } from 'express';
import { ISystem } from '../interfaces/ISystem';
import SystemServices from '../services/SystemServices';
import HttpStatusCode from '../helpers/HttpStatusCode';

class SystemControllers {
  constructor(private _service: SystemServices) {
    this.create = this.create.bind(this)
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const payload: ISystem = req.body;

    const response = await this._service.create(payload);
    return res.status(HttpStatusCode.CREATED).json(response);
  }
}

export default SystemControllers;
