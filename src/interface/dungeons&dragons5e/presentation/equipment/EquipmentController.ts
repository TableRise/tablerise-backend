import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { EquipmentControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/equipment/EquipmentController';

export default class EquipmentController {
    private readonly getEquipmentOperation;
    private readonly getAllEquipmentOperation;
    private readonly getDisabledEquipmentOperation;
    private readonly toggleEquipmentAvailabilityOperation;

    constructor({
        getEquipmentOperation,
        getAllEquipmentOperation,
        getDisabledEquipmentOperation,
        toggleEquipmentAvailabilityOperation,
    }: EquipmentControllerContract) {
        this.getEquipmentOperation = getEquipmentOperation;
        this.getAllEquipmentOperation = getAllEquipmentOperation;
        this.getDisabledEquipmentOperation = getDisabledEquipmentOperation;
        this.toggleEquipmentAvailabilityOperation = toggleEquipmentAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getEquipmentOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllEquipmentOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledEquipmentOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleEquipmentAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
