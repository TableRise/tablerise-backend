import { Response, Request } from 'express';
import { container } from 'src/container';
import { RegisterUserPayload } from 'src/types/Response';
import { UsersControllerContract } from 'src/types/contracts/users/presentation/UsersController';

export default class UsersController extends UsersControllerContract {
    constructor({ httpStatusCode }: any) {
        super();
        this.httpStatusCode = httpStatusCode;
    }

    public async register(req: Request, res: Response): Promise<Response> {
        const { createUserOperation } = container;
        const payload = req.body as RegisterUserPayload;

        const result = await createUserOperation.execute(payload);
        return res.status(this.httpStatusCode.OK).json(result);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { verifyEmailOperation } = container;
        const { id } = req.params;

        const result = await verifyEmailOperation.execute(id);
        return res.status(this.httpStatusCode.OK).json(result);
    }
}
