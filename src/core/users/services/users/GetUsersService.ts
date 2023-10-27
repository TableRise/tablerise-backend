import { GetUsersServiceContract } from 'src/types/contracts/users/GetUsers';
import { RegisterUserResponsePromise } from 'src/types/requests/Response';

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

    public async get(): Promise<RegisterUserResponsePromise[]> {
        this._logger('info', 'Get - GetUsersService');
        const userInDb = await this._usersRepository.find({});
        const response: RegisterUserResponsePromise[] = [];

        userInDb.forEach((user) => {
            const userDetailInDb = this._usersDetailsRepository.findOne({ userId: user.userId });
            response.push({
                ...user,
                details: userDetailInDb
            });
        });

        await Promise.all(response);
    
        return response;
    }
}
