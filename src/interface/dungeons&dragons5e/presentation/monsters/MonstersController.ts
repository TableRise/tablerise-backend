import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { MonstersControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/monsters/MonstersController';

export default class MonstersController {
    private readonly _getMonsterOperation;
    private readonly _getAllMonstersOperation;
    private readonly _getDisabledMonstersOperation;
    private readonly _toggleMonstersAvailabilityOperation;

    constructor({
        getMonsterOperation,
        getAllMonstersOperation,
        getDisabledMonstersOperation,
        toggleMonstersAvailabilityOperation,
    }: MonstersControllerContract) {
        this._getMonsterOperation = getMonsterOperation;
        this._getAllMonstersOperation = getAllMonstersOperation;
        this._getDisabledMonstersOperation = getDisabledMonstersOperation;
        this._toggleMonstersAvailabilityOperation = toggleMonstersAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getMonsterOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllMonstersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledMonstersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleMonstersAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
