import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { FeatsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/feats/FeatsController';

export default class FeatsController {
    private readonly _getFeatOperation;
    private readonly _getAllFeatsOperation;
    private readonly _getDisabledFeatsOperation;
    private readonly _toggleFeatsAvailabilityOperation;

    constructor({
        getFeatOperation,
        getAllFeatsOperation,
        getDisabledFeatsOperation,
        toggleFeatsAvailabilityOperation,
    }: FeatsControllerContract) {
        this._getFeatOperation = getFeatOperation;
        this._getAllFeatsOperation = getAllFeatsOperation;
        this._getDisabledFeatsOperation = getDisabledFeatsOperation;
        this._toggleFeatsAvailabilityOperation = toggleFeatsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getFeatOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllFeatsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledFeatsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleFeatsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
