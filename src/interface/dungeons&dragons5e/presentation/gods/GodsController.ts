import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { GodsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/gods/GodsController';

export default class GodsController {
    private readonly getGodOperation;
    private readonly getAllGodsOperation;
    private readonly getDisabledGodsOperation;
    private readonly toggleGodsAvailabilityOperation;

    constructor({
        getGodOperation,
        getAllGodsOperation,
        getDisabledGodsOperation,
        toggleGodsAvailabilityOperation,
    }: GodsControllerContract) {
        this.getGodOperation = getGodOperation;
        this.getAllGodsOperation = getAllGodsOperation;
        this.getDisabledGodsOperation = getDisabledGodsOperation;
        this.toggleGodsAvailabilityOperation = toggleGodsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getGodOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllGodsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledGodsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleGodsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
