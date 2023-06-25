import { Request, Response } from 'express';
import SystemsServices from 'src/services/SystemsServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { IUpdateContent } from 'src/schemas/updateContentSchema';
import { ISystem } from 'src/schemas/systemsValidationSchema';

export default class SystemsControllers {
  constructor(readonly _service: SystemsServices) {
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.updateContent = this.updateContent.bind(this);
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

  public async update(req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const payload = req.body as ISystem;

    const request = await this._service.update(_id, payload);
    return res.status(HttpStatusCode.OK).json(request);
  }

  public async updateContent(req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const { entity } = req.query;
    const payload = req.body as IUpdateContent;

    const request = await this._service.updateContent(_id, entity as string, payload);
    return res.status(HttpStatusCode.OK).send(request);
  }
}
