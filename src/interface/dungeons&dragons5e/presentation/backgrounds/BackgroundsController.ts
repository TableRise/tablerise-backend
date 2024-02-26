import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { BackgroundsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsController';

export default class BackgroundsController {
    private readonly _getBackgroundOperation;
    private readonly _getAllBackgroundsOperation;
    private readonly _getDisabledBackgroundsOperation;
    private readonly _toggleBackgroundsAvailabilityOperation;

    constructor({
        getBackgroundOperation,
        getAllBackgroundsOperation,
        getDisabledBackgroundsOperation,
        toggleBackgroundsAvailabilityOperation,
    }: BackgroundsControllerContract) {
        this._getBackgroundOperation = getBackgroundOperation;
        this._getAllBackgroundsOperation = getAllBackgroundsOperation;
        this._getDisabledBackgroundsOperation = getDisabledBackgroundsOperation;
        this._toggleBackgroundsAvailabilityOperation =
            toggleBackgroundsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getBackgroundOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllBackgroundsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledBackgroundsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleBackgroundsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
