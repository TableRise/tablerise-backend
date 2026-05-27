import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GetByIdPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class GetUserByIdService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['getUserByIdServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get({ userId }: GetByIdPayload): Promise<RegisterUserResponse> {
        const callName = `[${this.constructor.name}] - ${this.get.name}`;
        this.logger('info', callName);
        const userInDb = await this.usersRepository.findOne({ userId });
        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetailInDb) HttpRequestErrors.throwError('user-inexistent');

        return {
            ...userInDb,
            details: userDetailInDb,
        };
    }
}
