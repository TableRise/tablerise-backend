import { GetUserByIdServiceContract } from 'src/types/users/contracts/core/GetUserById';
import { GetByIdPayload } from 'src/types/users/requests/Payload';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

export default class GetUserByIdService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({ usersRepository, usersDetailsRepository, logger }: GetUserByIdServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get({ userId }: GetByIdPayload): Promise<RegisterUserResponse> {
        this._logger('info', 'Get - GetUserByIdService');
        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        return {
            ...userInDb,
            details: userDetailInDb
        }
    }
}
