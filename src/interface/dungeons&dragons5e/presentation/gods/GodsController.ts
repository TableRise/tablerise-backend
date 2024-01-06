import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { GodsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/gods/GodsController';

export default class GodsController {
    private readonly _getGodOperation;
    private readonly _getAllGodsOperation;
    private readonly _getDisabledGodsOperation;
    private readonly _toggleGodsAvailabilityOperation;

    constructor({
        getGodOperation,
        getAllGodsOperation,
        getDisabledGodsOperation,
        toggleGodsAvailabilityOperation,
    }: GodsControllerContract) {
        this._getGodOperation = getGodOperation;
        this._getAllGodsOperation = getAllGodsOperation;
        this._getDisabledGodsOperation = getDisabledGodsOperation;
        this._toggleGodsAvailabilityOperation = toggleGodsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getGodOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllGodsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledGodsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleGodsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
