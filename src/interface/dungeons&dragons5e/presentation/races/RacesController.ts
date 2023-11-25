import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { RacesControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/races/RacesController';

export default class RacesController {
    private readonly _getRaceOperation;
    private readonly _getAllRacesOperation;
    private readonly _getDisabledRacesOperation;
    private readonly _toggleRacesAvailabilityOperation;

    constructor({
        getRaceOperation,
        getAllRacesOperation,
        getDisabledRacesOperation,
        toggleRacesAvailabilityOperation,
    }: RacesControllerContract) {
        this._getRaceOperation = getRaceOperation;
        this._getAllRacesOperation = getAllRacesOperation;
        this._getDisabledRacesOperation = getDisabledRacesOperation;
        this._toggleRacesAvailabilityOperation = toggleRacesAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getRaceOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllRacesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledRacesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleRacesAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
