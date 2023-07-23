import { Request, Response } from 'express';
import SystemServices from 'src/services/SystemServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import { System } from 'src/schemas/systemValidationSchema';

export default class SystemControllers {
    constructor(readonly _service: SystemServices) {
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
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
        const payload = req.body as System;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateContent(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;
        const { entity } = req.query;
        const payload = req.body as UpdateContent;

        const request = await this._service.updateContent(_id, entity as string, payload);
        return res.status(HttpStatusCode.CREATED).send(request);
    }

    public async activate(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;

        const request = await this._service.activate(_id);
        return res.status(HttpStatusCode.OK).send(request);
    }

    public async deactivate(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;

        const request = await this._service.deactivate(_id);
        return res.status(HttpStatusCode.OK).send(request);
    }
}
