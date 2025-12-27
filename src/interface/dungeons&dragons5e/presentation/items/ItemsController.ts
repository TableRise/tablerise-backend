import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { ItemsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/items/ItemsController';

export default class ItemsController {
    private readonly getItemOperation;
    private readonly getAllItemsOperation;
    private readonly getDisabledItemsOperation;
    private readonly toggleItemsAvailabilityOperation;

    constructor({
        getItemOperation,
        getAllItemsOperation,
        getDisabledItemsOperation,
        toggleItemsAvailabilityOperation,
    }: ItemsControllerContract) {
        this.getItemOperation = getItemOperation;
        this.getAllItemsOperation = getAllItemsOperation;
        this.getDisabledItemsOperation = getDisabledItemsOperation;
        this.toggleItemsAvailabilityOperation = toggleItemsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getItemOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleItemsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
