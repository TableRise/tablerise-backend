import { Response, Request } from 'express';
import { container } from 'src/container';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

export default class ArmorsController {
    public async getAll(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('getAllArmorsOperation');

        const result = await execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getDisabled(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('getDisabledArmorsOperation');

        const result = await execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async get(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('getArmorOperation');

        const { id } = req.params;

        const result = await execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async toggleAvailability(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('toggleArmorsAvailabilityOperation');

        const { id } = req.params;
        const { availability } = req.query;

        const result = await execute({ id, availability });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
