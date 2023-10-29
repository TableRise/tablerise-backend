import Discord from 'passport-discord';
import { OAuthOperationContract } from 'src/types/users/contracts/presentation/oauth/OAuth';
import { RegisterUserResponse } from 'src/types/users/requests/Response';

export default class FacebookOperation {
    private readonly _oAuthService;
    private readonly _logger;

    constructor({ oAuthService, logger }: OAuthOperationContract) {
        this._oAuthService = oAuthService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        payload: Discord.Profile
    ): Promise<RegisterUserResponse | string> {
        this._logger('info', 'Execute - DiscordOperation');

        const entitySerialized = await this._oAuthService.serialize(payload);

        if (typeof entitySerialized === 'string') return entitySerialized;

        const entityEnriched = await this._oAuthService.enrichment(
            {
                user: entitySerialized.userSerialized,
                userDetails: entitySerialized.userDetailsSerialized,
            },
            'discord'
        );

        const userSaved = await this._oAuthService.saveUser({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        return {
            ...userSaved.userSaved,
            details: userSaved.userDetailsSaved,
        };
    }
}
