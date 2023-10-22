import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

export interface UsersControllerContract {
    httpStatusCode: typeof HttpStatusCode;
}
