import { Request, Response } from 'express';
import WikisServices from 'src/services/WikisService';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';

export default class WikisControllers {
    constructor(
        private readonly _service: WikisServices,
        private readonly _logger: LoggerType
    ) {
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAll] made to wiki');
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findOne] made to wiki');
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [update] made to wiki');
        const { id: _id } = req.params;
        const payload = req.body as Internacional<Wiki>;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.params;

        await this._service.delete(_id);
        return res.status(HttpStatusCode.DELETED).end();
    }
}
