import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import Google from 'passport-google-oauth20';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

export default class GoogleOperation {
    private readonly _oAuthService;
    private readonly _logger;

    constructor({ oAuthService, logger }: OAuthCoreDependencies['oAuthOperationContract']) {
        this._oAuthService = oAuthService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: Google.Profile): Promise<RegisterUserResponse | string> {
        this._logger('info', 'Execute - GoogleOperation');

        const entitySerialized = await this._oAuthService.serialize(payload);

        if (typeof entitySerialized === 'string') return entitySerialized;

        const entityEnriched = await this._oAuthService.enrichment(
            {
                user: entitySerialized.userSerialized,
                userDetails: entitySerialized.userDetailsSerialized,
            },
            'google'
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
