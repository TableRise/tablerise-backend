import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { BackgroundsControllerContract } from 'src/types/dungeons&dragons5e/contracts/presentation/BackgroundsController';

export default class BackgroundsController {
    private readonly _getAllBackgroundsOperation;

    constructor({ getAllBackgroundsOperation }: BackgroundsControllerContract) {
        this._getAllBackgroundsOperation = getAllBackgroundsOperation;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this._getAllBackgroundsOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }
}
