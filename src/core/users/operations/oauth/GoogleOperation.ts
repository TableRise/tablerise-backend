import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import Google from 'passport-google-oauth20';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { __TokenObject } from 'src/types/api/users/methods';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

export default class GoogleOperation {
    private readonly _oAuthService;
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        oAuthService,
        usersRepository,
        logger,
    }: OAuthCoreDependencies['oAuthOperationContract']) {
        this._oAuthService = oAuthService;
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        payload: Google.Profile
    ): Promise<RegisterUserResponse | __TokenObject> {
        this._logger('info', 'Execute - GoogleOperation');

        const entitySerialized = await this._oAuthService.serialize(payload);

        const user = await this._usersRepository.find({
            email: entitySerialized.userSerialized.email,
        });

        if (!user.length)
            return this._createUser(
                entitySerialized.userSerialized,
                entitySerialized.userDetailsSerialized
            );

        return this._oAuthService.login(user[0], entitySerialized.userSerialized);
    }

    private async _createUser(
        userSerialized: UserInstance,
        userDetailsSerialized: UserDetailInstance
    ): Promise<RegisterUserResponse> {
        this._logger('info', 'CreateUser - GoogleOperation');

        const entityEnriched = await this._oAuthService.enrichment(
            {
                user: userSerialized,
                userDetails: userDetailsSerialized,
            },
            'google'
        );

        const userSaved = await this._oAuthService.saveUser({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        const { token } = this._oAuthService.login(
            userSaved.userSaved,
            userSaved.userSaved
        );

        return {
            ...userSaved.userSaved,
            details: userSaved.userDetailsSaved,
            token,
        };
    }
}
