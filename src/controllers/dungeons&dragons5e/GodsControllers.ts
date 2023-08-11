import { Request, Response } from 'express';
import GodsServices from 'src/services/dungeons&dragons5e/GodsServices';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { God } from 'src/schemas/godsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';

export default class GodsControllers {
    constructor(
        private readonly _service: GodsServices,
        private readonly _logger: LoggerType
    ) {
        this.findAll = this.findAll.bind(this);
        this.findAllDisabled = this.findAllDisabled.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.updateAvailability = this.updateAvailability.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAll] made to gods');
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findAllDisabled(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAllDisabled] made to gods');
        const request = await this._service.findAllDisabled();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findOne] made to gods');
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [update] made to gods');
        const { id: _id } = req.params;
        const payload = req.body as Internacional<God>;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateAvailability(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [updateAvailability] made to gods');
        const { id: _id } = req.params;
        const { availability } = req.query;
        const query = availability === 'true';

        const request = await this._service.updateAvailability(_id, query);
        return res.status(HttpStatusCode.OK).json(request);
    }
}
