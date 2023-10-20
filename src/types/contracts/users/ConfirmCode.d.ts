import { MongoModel } from '@tablerise/database-management';
import ConfirmCodeService from 'src/core/users/services/ConfirmCodeService';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { Logger } from 'src/types/Logger';

export abstract class ConfirmCodeOperationContract {
    confirmCodeService: ConfirmCodeService;
    logger: Logger
}

export abstract class ConfirmCodeServiceContract {
    httpRequestErrors: HttpRequestErrors;
    usersModel: MongoModel<UserInstance>
    logger: Logger
}
