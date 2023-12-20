import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { MagicItemsControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/magicItems/MagicItemsController';

export default class MagicItemsController {
    private readonly _getMagicItemOperation;
    private readonly _getAllMagicItemsOperation;
    private readonly _getDisabledMagicItemsOperation;
    private readonly _toggleMagicItemsAvailabilityOperation;

    constructor({
        getMagicItemOperation,
        getAllMagicItemsOperation,
        getDisabledMagicItemsOperation,
        toggleMagicItemsAvailabilityOperation,
    }: MagicItemsControllerContract) {
        this._getMagicItemOperation = getMagicItemOperation;
        this._getAllMagicItemsOperation = getAllMagicItemsOperation;
        this._getDisabledMagicItemsOperation = getDisabledMagicItemsOperation;
        this._toggleMagicItemsAvailabilityOperation =
            toggleMagicItemsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getMagicItemOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllMagicItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledMagicItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleMagicItemsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
