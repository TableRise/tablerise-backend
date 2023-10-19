import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';

export abstract class UsersControllerContract {
    httpStatusCode: typeof HttpStatusCode;
}
