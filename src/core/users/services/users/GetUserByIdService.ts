import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GetByIdPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

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
        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });

        if (userInDb.inProgress.status === InProgressStatusEnum.enum.WAIT_TO_DELETE_USER)
            HttpRequestErrors.throwError('user-inexistent');

        return {
            ...userInDb,
            details: userDetailInDb,
        };
    }
}
