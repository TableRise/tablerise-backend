import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { ArmorsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/armors/ArmorsController';

export default class ArmorsController {
    private readonly getArmorOperation;
    private readonly getAllArmorsOperation;
    private readonly getDisabledArmorsOperation;
    private readonly toggleArmorsAvailabilityOperation;

    constructor({
        getArmorOperation,
        getAllArmorsOperation,
        getDisabledArmorsOperation,
        toggleArmorsAvailabilityOperation,
    }: ArmorsControllerContract) {
        this.getArmorOperation = getArmorOperation;
        this.getAllArmorsOperation = getAllArmorsOperation;
        this.getDisabledArmorsOperation = getDisabledArmorsOperation;
        this.toggleArmorsAvailabilityOperation = toggleArmorsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getArmorOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllArmorsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledArmorsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleArmorsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
