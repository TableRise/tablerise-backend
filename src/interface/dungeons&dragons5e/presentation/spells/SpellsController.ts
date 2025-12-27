import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { SpellsControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/spells/SpellsController';

export default class SpellsController {
    private readonly getSpellOperation;
    private readonly getAllSpellsOperation;
    private readonly getDisabledSpellsOperation;
    private readonly toggleSpellsAvailabilityOperation;

    constructor({
        getSpellOperation,
        getAllSpellsOperation,
        getDisabledSpellsOperation,
        toggleSpellsAvailabilityOperation,
    }: SpellsControllerContract) {
        this.getSpellOperation = getSpellOperation;
        this.getAllSpellsOperation = getAllSpellsOperation;
        this.getDisabledSpellsOperation = getDisabledSpellsOperation;
        this.toggleSpellsAvailabilityOperation = toggleSpellsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getSpellOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllSpellsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledSpellsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleSpellsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
