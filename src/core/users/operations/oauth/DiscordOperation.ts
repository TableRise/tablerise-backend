import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import Discord from 'passport-discord';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export default class DiscordOperation {
    private readonly oAuthService;
    private readonly usersRepository;
    private readonly logger;

    constructor({ oAuthService, usersRepository, logger }: OAuthCoreDependencies['oAuthOperationContract']) {
        this.oAuthService = oAuthService;
        this.usersRepository = usersRepository;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: Discord.Profile): Promise<RegisterUserResponse> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const entitySerialized = await this.oAuthService.serialize(payload);

        const user = await this.usersRepository.find({
            email: entitySerialized.userSerialized.email,
        });

        if (!user.length)
            return this.createUser(entitySerialized.userSerialized, entitySerialized.userDetailsSerialized);

        return this.oAuthService.login(user[0], entitySerialized.userSerialized);
    }

    private async createUser(userSerialized: User, userDetailsSerialized: UserDetail): Promise<RegisterUserResponse> {
        const callName = `[${this.constructor.name}] - ${this.createUser.name}`;
        this.logger('info', callName);

        const entityEnriched = await this.oAuthService.enrichment(
            {
                user: userSerialized,
                userDetails: userDetailsSerialized,
            },
            'discord'
        );

        const userSaved = await this.oAuthService.saveUser({
            user: entityEnriched.userEnriched,
            userDetails: entityEnriched.userDetailsEnriched,
        });

        const { token } = this.oAuthService.login(userSaved.userSaved, userSaved.userSaved);

        return {
            ...userSaved.userSaved,
            details: userSaved.userDetailsSaved,
            token,
        };
    }
}
