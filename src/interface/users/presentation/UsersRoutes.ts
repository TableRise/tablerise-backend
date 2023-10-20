import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam from 'src/routes/parametersWrapper';
import mock from 'src/support/mocks/user';
import { UsersRoutesContract } from 'src/types/contracts/users/presentation/UsersRoutes';

const BASE_PATH = '/profile';

export default class UsersRoutes extends UsersRoutesContract {
    constructor({ usersController, verifyIdMiddleware }: UsersRoutesContract) {
        super();
        this.usersController = usersController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}/:id/verify`,
                parameters: [...generateIDParam()],
                controller: this.usersController.verifyEmail,
                options: {
                    middlewares: [this.verifyIdMiddleware],
                    authentication: false,
                    tag: 'authentication',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this.usersController.register,
                schema: mock.user.userPayload,
                options: {
                    authentication: false,
                    tag: 'register',
                },
            },
        ] as routeInstance[]
    }
}
