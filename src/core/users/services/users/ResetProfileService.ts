import { ResetProfileServiceContract } from 'src/types/contracts/users/ResetProfile';

export default class ResetProfileService {
    private readonly _userDetailsRepository;
    private readonly _logger;

    constructor({ userDetailsRepository, logger }: ResetProfileServiceContract) {
        this._userDetailsRepository = userDetailsRepository;
        this._logger = logger;

        this.reset = this.reset.bind(this);
    }

    public async reset(userId: string): Promise<void> {
        this._logger('info', 'Reset - ResetProfileService');
        const [userDetailInDb] = await this._userDetailsRepository.find({ userId });

        userDetailInDb.gameInfo.badges = [];
        userDetailInDb.gameInfo.campaigns = [];
        userDetailInDb.gameInfo.characters = [];

        await this._userDetailsRepository.update({
            id: userDetailInDb.userDetailId,
            payload: userDetailInDb,
        });
    }
}
