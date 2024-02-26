import { LoginResponse } from 'src/types/api/users/http/response';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LoginUserOperation {
    private readonly _loginUserService;
    private readonly _logger;

    constructor({ loginUserService, logger }: UserCoreDependencies['loginUserOperationContract']) {
        this._loginUserService = loginUserService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(token: string): Promise<LoginResponse> {
        this._logger('info', 'Execute - LoginUserOperation');

        const tokenData = await this._loginUserService.enrichToken(token);
        const cookieOptions = this._loginUserService.setCookieOptions();

        return { tokenData, cookieOptions };
    }
}
