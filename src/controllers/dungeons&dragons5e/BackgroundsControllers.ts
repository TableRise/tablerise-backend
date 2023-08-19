import { DnDBackground, Internacional } from '@tablerise/database-management';
import { Request, Response } from 'express';
import BackgroundsServices from 'src/services/dungeons&dragons5e/BackgroundsServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';

export default class BackgroundsControllers {
    constructor(
        private readonly _service: BackgroundsServices,
        private readonly _logger: Logger
    ) {
        this.findAll = this.findAll.bind(this);
        this.findAllDisabled = this.findAllDisabled.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.updateAvailability = this.updateAvailability.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAll] made to backgrounds');
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findAllDisabled(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAllDisabled] made to backgrounds');
        const request = await this._service.findAllDisabled();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findOne] made to backgrounds');
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [update] made to backgrounds');
        const { id: _id } = req.params;
        const payload = req.body as Internacional<DnDBackground>;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateAvailability(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [updateAvailability] made to backgrounds');
        const { id: _id } = req.params;
        const { availability } = req.query;
        const query = availability === 'true';

        const request = await this._service.updateAvailability(_id, query);
        return res.status(HttpStatusCode.OK).json(request);
    }
}
