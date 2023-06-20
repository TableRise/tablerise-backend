import { Request, Response } from 'express';
import SystemsServices from 'src/services/SystemsServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default class SystemsControllers {
  constructor(readonly _service: SystemsServices) {
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  public async findAll(_req: Request, res: Response): Promise<Response> {
    const request = await this._service.findAll();
    return res.status(HttpStatusCode.OK).json(request);
  }

  public async findOne(req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;

    const request = await this._service.findOne(_id);
    return res.status(HttpStatusCode.OK).json(request);
  }
}
