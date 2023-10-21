import { Response, Request } from 'express';
import { container } from 'src/container';
import { RegisterUserPayload } from 'src/types/requests/Payload';
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
        return res.status(this.httpStatusCode.CREATED).json(result);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { verifyEmailOperation } = container;
        const { userId } = req.params;

        const result = await verifyEmailOperation.execute(userId);
        return res.status(this.httpStatusCode.OK).json(result);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { user: token } = req;
        return res.status(this.httpStatusCode.OK).json({ token });
    }

    public async confirmCode(req: Request, res: Response): Promise<Response> {
        const { confirmCodeOperation } = container;

        const { userId } = req.params;
        const { code } = req.query;

        const result = await confirmCodeOperation.execute({ userId, code });
        return res.status(this.httpStatusCode.OK).json(result);
    }

    public async activateTwoFactor(req: Request, res: Response): Promise<Response> {
        const { activateTwoFactorOperation } = container;

        const { userId } = req.params;

        const result = await activateTwoFactorOperation.execute(userId);
        return res.status(this.httpStatusCode.OK).json(result);
    }

    public async resetTwoFactor(req: Request, res: Response): Promise<Response> {
        const { resetTwoFactorOperation } = container;

        const { userId } = req.params;
        const { code } = req.query;

        const result = await resetTwoFactorOperation.execute({ userId, code });
        return res.status(this.httpStatusCode.OK).json(result);
    }

    public async updateEmail(req: Request, res: Response): Promise<Response> {
        const { updateEmailOperation } = container;

        const { userId } = req.params;
        const { code } = req.query;
        const { email } = req.body;

        const result = await updateEmailOperation.execute({ userId, code, email });
        return res.status(this.httpStatusCode.OK).json(result);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { deleteUserOperation } = container;

        const { userId } = req.params;

        await deleteUserOperation.execute(userId);
        return res.status(this.httpStatusCode.OK).end();
    }
}
