import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { ClassesControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/classes/ClassesController';

export default class ClassesController {
    private readonly getClassOperation;
    private readonly getAllClassesOperation;
    private readonly getDisabledClassesOperation;
    private readonly toggleClassesAvailabilityOperation;

    constructor({
        getClassOperation,
        getAllClassesOperation,
        getDisabledClassesOperation,
        toggleClassesAvailabilityOperation,
    }: ClassesControllerContract) {
        this.getClassOperation = getClassOperation;
        this.getAllClassesOperation = getAllClassesOperation;
        this.getDisabledClassesOperation = getDisabledClassesOperation;
        this.toggleClassesAvailabilityOperation = toggleClassesAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getClassOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllClassesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledClassesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleClassesAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
