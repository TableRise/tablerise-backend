import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { WeaponsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/weapons/WeaponsController';

export default class WeaponsController {
    private readonly getWeaponOperation;
    private readonly getAllWeaponsOperation;
    private readonly getDisabledWeaponsOperation;
    private readonly toggleWeaponsAvailabilityOperation;

    constructor({
        getWeaponOperation,
        getAllWeaponsOperation,
        getDisabledWeaponsOperation,
        toggleWeaponsAvailabilityOperation,
    }: WeaponsControllerContract) {
        this.getWeaponOperation = getWeaponOperation;
        this.getAllWeaponsOperation = getAllWeaponsOperation;
        this.getDisabledWeaponsOperation = getDisabledWeaponsOperation;
        this.toggleWeaponsAvailabilityOperation = toggleWeaponsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getWeaponOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllWeaponsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledWeaponsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleWeaponsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
