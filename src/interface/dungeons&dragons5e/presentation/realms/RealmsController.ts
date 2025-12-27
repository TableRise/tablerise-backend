import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { RealmsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/realms/RealmsController';

export default class RealmsController {
    private readonly getRealmOperation;
    private readonly getAllRealmsOperation;
    private readonly getDisabledRealmsOperation;
    private readonly toggleRealmsAvailabilityOperation;

    constructor({
        getRealmOperation,
        getAllRealmsOperation,
        getDisabledRealmsOperation,
        toggleRealmsAvailabilityOperation,
    }: RealmsControllerContract) {
        this.getRealmOperation = getRealmOperation;
        this.getAllRealmsOperation = getAllRealmsOperation;
        this.getDisabledRealmsOperation = getDisabledRealmsOperation;
        this.toggleRealmsAvailabilityOperation = toggleRealmsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getRealmOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllRealmsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledRealmsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleRealmsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
