import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { RacesControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/races/RacesController';

export default class RacesController {
    private readonly getRaceOperation;
    private readonly getAllRacesOperation;
    private readonly getDisabledRacesOperation;
    private readonly toggleRacesAvailabilityOperation;

    constructor({
        getRaceOperation,
        getAllRacesOperation,
        getDisabledRacesOperation,
        toggleRacesAvailabilityOperation,
    }: RacesControllerContract) {
        this.getRaceOperation = getRaceOperation;
        this.getAllRacesOperation = getAllRacesOperation;
        this.getDisabledRacesOperation = getDisabledRacesOperation;
        this.toggleRacesAvailabilityOperation = toggleRacesAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getRaceOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllRacesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledRacesOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleRacesAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
