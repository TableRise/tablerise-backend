import { routeInstance } from '@tablerise/auto-swagger';
import mock from 'src/support/mocks/user';
import { UsersRoutesContract } from 'src/types/contracts/users/presentation/UsersRoutes';

const BASE_PATH = '/profile';

export default class UsersRoutes extends UsersRoutesContract {
    constructor({ usersController }: UsersRoutesContract) {
        super();
        this.usersController = usersController;
    }

    public routes(): routeInstance[] {
        return [
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
