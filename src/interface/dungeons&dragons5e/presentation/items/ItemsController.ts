import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { ItemsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/items/ItemsController';

export default class ItemsController {
    private readonly _getItemOperation;
    private readonly _getAllItemsOperation;
    private readonly _getDisabledItemsOperation;
    private readonly _toggleItemsAvailabilityOperation;

    constructor({
        getItemOperation,
        getAllItemsOperation,
        getDisabledItemsOperation,
        toggleItemsAvailabilityOperation,
    }: ItemsControllerContract) {
        this._getItemOperation = getItemOperation;
        this._getAllItemsOperation = getAllItemsOperation;
        this._getDisabledItemsOperation = getDisabledItemsOperation;
        this._toggleItemsAvailabilityOperation = toggleItemsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getItemOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleItemsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
