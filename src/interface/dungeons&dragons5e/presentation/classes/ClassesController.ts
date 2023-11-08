import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { ClassesControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/classes/ClassesController';

export default class ClassesController {
    private readonly _getClassOperation;
    private readonly _getAllClassesOperation;
    private readonly _getDisabledClassesOperation;
    private readonly _toggleClassesAvailabilityOperation;

    constructor({
        getClassOperation,
        getAllClassesOperation,
        getDisabledClassesOperation,
        toggleClassesAvailabilityOperation,
    }: ClassesControllerContract) {
        this._getClassOperation = getClassOperation;
        this._getAllClassesOperation = getAllClassesOperation;
        this._getDisabledClassesOperation = getDisabledClassesOperation;
        this._toggleClassesAvailabilityOperation = toggleClassesAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getClassOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllClassesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledClassesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleClassesAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
