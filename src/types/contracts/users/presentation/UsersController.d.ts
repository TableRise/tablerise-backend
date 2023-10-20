import { HttpStatusCode } from 'src/infra/helpers/HttpStatusCode';

export abstract class UsersControllerContract {
    httpStatusCode: typeof HttpStatusCode;
}
