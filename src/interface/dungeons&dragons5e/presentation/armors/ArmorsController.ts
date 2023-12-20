import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { ArmorsControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/armors/ArmorsController';

export default class ArmorsController {
    private readonly _getArmorOperation;
    private readonly _getAllArmorsOperation;
    private readonly _getDisabledArmorsOperation;
    private readonly _toggleArmorsAvailabilityOperation;

    constructor({
        getArmorOperation,
        getAllArmorsOperation,
        getDisabledArmorsOperation,
        toggleArmorsAvailabilityOperation,
    }: ArmorsControllerContract) {
        this._getArmorOperation = getArmorOperation;
        this._getAllArmorsOperation = getAllArmorsOperation;
        this._getDisabledArmorsOperation = getDisabledArmorsOperation;
        this._toggleArmorsAvailabilityOperation = toggleArmorsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getArmorOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllArmorsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledArmorsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleArmorsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
