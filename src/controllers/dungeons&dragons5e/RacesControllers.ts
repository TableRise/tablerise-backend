import { Request, Response } from 'express';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import RacesServices from 'src/services/dungeons&dragons5e/RacesServices';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';

export default class RacesControllers {
    constructor(
        private readonly _service: RacesServices,
        private readonly _logger: Logger
    ) {
        this.findAll = this.findAll.bind(this);
        this.findAllDisabled = this.findAllDisabled.bind(this);
        this.findOne = this.findOne.bind(this);
        this.update = this.update.bind(this);
        this.updateAvailability = this.updateAvailability.bind(this);
    }

    public async findAll(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAll] made to races');
        const request = await this._service.findAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findAllDisabled(_req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findAllDisable] made to races');
        const request = await this._service.findAllDisabled();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async findOne(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [findOne] made to races');
        const { id: _id } = req.params;

        const request = await this._service.findOne(_id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [update] made to races');
        const { id: _id } = req.params;
        const payload = req.body as Internacional<Race>;

        const request = await this._service.update(_id, payload);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateAvailability(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request [updateAvailability] made to races');
        const { id: _id } = req.params;
        const { availability } = req.query;
        const query = availability === 'true';

        const request = await this._service.updateAvailability(_id, query);
        return res.status(HttpStatusCode.OK).json(request);
    }
}
