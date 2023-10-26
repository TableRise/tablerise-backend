import Facebook from 'passport-facebook';
import { OAuthOperationContract } from 'src/types/contracts/oauth/OAuth';
import { RegisterUserResponse } from 'src/types/requests/Response';

export default class FacebookOperation {
    private readonly _oAuthService;
    private readonly _logger;

    constructor({ oAuthService, logger }: OAuthOperationContract) {
        this._oAuthService = oAuthService;
        this._logger = logger;
    }

    public async execute(
        payload: Facebook.Profile
    ): Promise<RegisterUserResponse | string> {
        this._logger('info', 'Execute - FacebookOperation');

        const entitySerialized = await this._oAuthService.serialize(payload);

        if (typeof entitySerialized === 'string') return entitySerialized;

        const entityEnriched = await this._oAuthService.enrichment(
            {
                user: entitySerialized.userSerialized,
                userDetails: entitySerialized.userDetailsSerialized,
            },
            'facebook'
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
