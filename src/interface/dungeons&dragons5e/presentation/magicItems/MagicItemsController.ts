import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { MagicItemsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsController';

export default class MagicItemsController {
    private readonly getMagicItemOperation;
    private readonly getAllMagicItemsOperation;
    private readonly getDisabledMagicItemsOperation;
    private readonly toggleMagicItemsAvailabilityOperation;

    constructor({
        getMagicItemOperation,
        getAllMagicItemsOperation,
        getDisabledMagicItemsOperation,
        toggleMagicItemsAvailabilityOperation,
    }: MagicItemsControllerContract) {
        this.getMagicItemOperation = getMagicItemOperation;
        this.getAllMagicItemsOperation = getAllMagicItemsOperation;
        this.getDisabledMagicItemsOperation = getDisabledMagicItemsOperation;
        this.toggleMagicItemsAvailabilityOperation = toggleMagicItemsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getMagicItemOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllMagicItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledMagicItemsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleMagicItemsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
