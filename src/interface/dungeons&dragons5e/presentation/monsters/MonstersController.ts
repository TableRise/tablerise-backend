import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { MonstersControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/monsters/MonstersController';

export default class MonstersController {
    private readonly getMonsterOperation;
    private readonly getAllMonstersOperation;
    private readonly getDisabledMonstersOperation;
    private readonly toggleMonstersAvailabilityOperation;

    constructor({
        getMonsterOperation,
        getAllMonstersOperation,
        getDisabledMonstersOperation,
        toggleMonstersAvailabilityOperation,
    }: MonstersControllerContract) {
        this.getMonsterOperation = getMonsterOperation;
        this.getAllMonstersOperation = getAllMonstersOperation;
        this.getDisabledMonstersOperation = getDisabledMonstersOperation;
        this.toggleMonstersAvailabilityOperation = toggleMonstersAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getMonsterOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllMonstersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledMonstersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleMonstersAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
