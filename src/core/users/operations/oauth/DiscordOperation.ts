import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import Discord from 'passport-discord';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class DiscordOperation {
    private readonly _oAuthService;
    private readonly _logger;

    constructor({
        oAuthService,
        logger,
    }: OAuthCoreDependencies['oAuthOperationContract']) {
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
