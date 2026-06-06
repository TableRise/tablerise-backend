import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UpdateUserCoverPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class UpdateUserCoverService {
    private readonly usersDetailsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        imageStorageClient,
        logger,
    }: UserCoreDependencies['updateUserCoverServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    public async update({ userId, image }: UpdateUserCoverPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        userDetails.cover = await this.imageStorageClient.upload(image);

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }
}
