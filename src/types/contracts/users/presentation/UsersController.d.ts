import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

export abstract class UsersControllerContract {
    httpStatusCode: typeof HttpStatusCode;
}
