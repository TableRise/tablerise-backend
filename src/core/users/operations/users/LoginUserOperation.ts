import { LoginResponse } from 'src/types/api/users/http/response';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LoginUserOperation {
    private readonly loginUserService;
    private readonly logger;

    constructor({ loginUserService, logger }: UserCoreDependencies['loginUserOperationContract']) {
        this.loginUserService = loginUserService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(token: string): Promise<LoginResponse> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const tokenData = await this.loginUserService.enrichToken(token);
        const cookieOptions = this.loginUserService.setCookieOptions();

        return { tokenData, cookieOptions };
    }
}
