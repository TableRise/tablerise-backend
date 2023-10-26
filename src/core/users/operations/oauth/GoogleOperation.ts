import Google from 'passport-google-oauth20';
import { OAuthOperationContract } from 'src/types/contracts/oauth/OAuth';
import { RegisterUserResponse } from 'src/types/requests/Response';

export default class GoogleOperation {
    private readonly _oAuthService;
    private readonly _logger;

    constructor({ oAuthService, logger }: OAuthOperationContract) {
        this._oAuthService = oAuthService;
        this._logger = logger;
    }

    public async execute(
        payload: Google.Profile
    ): Promise<RegisterUserResponse | string> {
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
