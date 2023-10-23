import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { GetUsersServiceContract } from 'src/types/contracts/users/GetUsers';
import { RegisterUserResponse } from 'src/types/requests/Response';

export default class GetUsersService {
    private readonly _logger;
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;

    constructor({ usersRepository, usersDetailsRepository, logger }: GetUsersServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(): Promise<RegisterUserResponse[]> {
        this._logger('info', 'Get - GetUsersService');
        const userInDb = await this._usersRepository.find({});
        const userDetailInDb = await this._usersDetailsRepository.find({});

        const formatResponse = userInDb.map((user) => {
            const userDetail = userDetailInDb.find((det) => det.userId === user.userId);

            if (!userDetail)
                HttpRequestErrors.throwError('user-database-critical-errror');
            
            return {
                ...user,
                details: userDetail
            }
        });

        return formatResponse;
    }
}
