import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { GetUsersServiceContract } from 'src/types/users/contracts/core/GetUsers';
import { RegisterUserResponse } from 'src/types/requests/Response';

export default class GetUsersService {
    private readonly _logger;
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: GetUsersServiceContract) {
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
                details: details as UserDetailInstance
            });
        });

        await Promise.all(response);
    
        return response;
    }
}
