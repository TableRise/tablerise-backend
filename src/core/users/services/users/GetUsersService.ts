import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

export default class GetUsersService {
    private readonly logger;
    private readonly usersRepository;
    private readonly usersDetailsRepository;

    constructor({ usersRepository, usersDetailsRepository, logger }: UserCoreDependencies['getUsersServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(): Promise<RegisterUserResponse[]> {
        this.logger('info', 'Get - GetUsersService');
        const userInDb = await this.usersRepository.find({});
        const userDetailInDb = await this.usersDetailsRepository.find({});
        const response: RegisterUserResponse[] = [];

        userInDb.forEach((user) => {
            const details = userDetailInDb.find((det) => det.userId === user.userId);

            response.push({
                ...user,
                details: details as UserDetail,
            });
        });

        await Promise.all(response);

        return response.filter((user) => user.inProgress.status !== InProgressStatusEnum.enum.WAIT_TO_DELETE_USER);
    }
}
