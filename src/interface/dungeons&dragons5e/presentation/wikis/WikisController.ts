import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { WikisControllerContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/wikis/WikisController';

export default class WikisController {
    private readonly getWikiOperation;
    private readonly getAllWikisOperation;
    private readonly getDisabledWikisOperation;
    private readonly toggleWikisAvailabilityOperation;

    constructor({
        getWikiOperation,
        getAllWikisOperation,
        getDisabledWikisOperation,
        toggleWikisAvailabilityOperation,
    }: WikisControllerContract) {
        this.getWikiOperation = getWikiOperation;
        this.getAllWikisOperation = getAllWikisOperation;
        this.getDisabledWikisOperation = getDisabledWikisOperation;
        this.toggleWikisAvailabilityOperation = toggleWikisAvailabilityOperation;

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDisabled = this.getDisabled.bind(this);
        this.toggleAvailability = this.toggleAvailability.bind(this);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getWikiOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllWikisOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const result = await this.getDisabledWikisOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { availability } = req.query;

        const result = await this.toggleWikisAvailabilityOperation.execute({
            id,
            availability: availability === 'true',
        });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
