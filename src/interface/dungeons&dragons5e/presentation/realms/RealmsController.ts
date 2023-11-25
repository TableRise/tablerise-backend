import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { RealmsControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/realms/RealmsController';

export default class RealmsController {
    private readonly _getRealmOperation;
    private readonly _getAllRealmsOperation;
    private readonly _getDisabledRealmsOperation;
    private readonly _toggleRealmsAvailabilityOperation;

    constructor({
        getRealmOperation,
        getAllRealmsOperation,
        getDisabledRealmsOperation,
        toggleRealmsAvailabilityOperation,
    }: RealmsControllerContract) {
        this._getRealmOperation = getRealmOperation;
        this._getAllRealmsOperation = getAllRealmsOperation;
        this._getDisabledRealmsOperation = getDisabledRealmsOperation;
        this._toggleRealmsAvailabilityOperation = toggleRealmsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getRealmOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllRealmsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledRealmsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleRealmsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
