import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class ResetProfileService {
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['resetProfileServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.reset = this.reset.bind(this);
    }

    public async reset(userId: string): Promise<void> {
        this._logger('info', 'Reset - ResetProfileService');
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        userDetailInDb.gameInfo.badges = [];
        userDetailInDb.gameInfo.campaigns = [];
        userDetailInDb.gameInfo.characters = [];

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }
}
