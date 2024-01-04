import LogoutUserService from 'src/core/users/services/users/LogoutUserService';
import TokenForbidden from 'src/domains/common/helpers/TokenForbidden';
import { Logger } from 'src/types/Logger';

export interface LogoutUserOperationContract {
    logoutUserService: LogoutUserService;
    logger: Logger;
}

export interface LogoutUserServiceContract {
    tokenForbidden: TokenForbidden;
    logger: Logger;
}
