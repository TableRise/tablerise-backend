import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class GetUsersService {
    private readonly _logger;
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['getUsersServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(): Promise<RegisterUserResponse[]> {
        this._logger('info', 'Get - GetUsersService');
        const userInDb = await this._usersRepository.find({});
        const userDetailInDb = await this._usersDetailsRepository.find({});
        const response: RegisterUserResponse[] = [];

        userInDb.forEach((user) => {
            const details = userDetailInDb.find((det) => det.userId === user.userId);

            response.push({
                ...user,
                details: details as UserDetailInstance,
            });
        });

        await Promise.all(response);

        return response.filter((user) => user.inProgress.status !== 'wait_to_delete');
    }
}
