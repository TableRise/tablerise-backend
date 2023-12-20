import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { SpellsControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/spells/SpellsController';

export default class SpellsController {
    private readonly _getSpellOperation;
    private readonly _getAllSpellsOperation;
    private readonly _getDisabledSpellsOperation;
    private readonly _toggleSpellsAvailabilityOperation;

    constructor({
        getSpellOperation,
        getAllSpellsOperation,
        getDisabledSpellsOperation,
        toggleSpellsAvailabilityOperation,
    }: SpellsControllerContract) {
        this._getSpellOperation = getSpellOperation;
        this._getAllSpellsOperation = getAllSpellsOperation;
        this._getDisabledSpellsOperation = getDisabledSpellsOperation;
        this._toggleSpellsAvailabilityOperation = toggleSpellsAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getSpellOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllSpellsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this._getDisabledSpellsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this._toggleSpellsAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
