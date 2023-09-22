import { Request, Response } from 'express';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import SystemServices from 'src/services/dungeons&dragons5e/SystemServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';

export default class SystemControllers {
    constructor(
        private readonly _service: SystemServices,
        private readonly _logger: Logger
    ) {
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.updateAvailability = this.updateAvailability.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAll] made to system');
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findOne] made to system');
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [update] made to system');
        const { id: _id } = req.params;
        const payload = req.body as System;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateContent(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [updateContent] made to system');
        const { id: _id } = req.params;
        const { entity } = req.query;
        const payload = req.body as UpdateContent;

        const request = await this._service.updateContent(_id, entity as string, payload);
        return res.status(HttpStatusCode.CREATED).send(request);
    }

    public async updateAvailability(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [updateAvailability] made to systems');
        const { id: _id } = req.params;
        const { availability } = req.query;
        const query = availability === 'true';

        const request = await this._service.updateAvailability(_id, query);
        
        return res.status(HttpStatusCode.OK).json(request);
    }
}
