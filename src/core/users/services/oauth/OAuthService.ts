import Discord from 'passport-discord';
import Google from 'passport-google-oauth20';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import newUUID from 'src/domains/common/helpers/newUUID';
import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import { __FullUser, __UserEnriched, __UserSaved, __UserSerialized } from 'src/types/api/users/methods';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

export default class OAuthService {
    private readonly usersRepository;
    private readonly userDetailsRepository;
    private readonly serializer;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        serializer,
        logger,
    }: OAuthCoreDependencies['oAuthServiceContract']) {
        this.usersRepository = usersRepository;
        this.userDetailsRepository = usersDetailsRepository;
        this.serializer = serializer;
        this.logger = logger;

        this.login = this.login.bind(this);
        this.serialize = this.serialize.bind(this);
        this.enrichment = this.enrichment.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    public login(userInDb: User, userSerialized: User): RegisterUserResponse {
        const callName = `[${this.constructor.name}] - ${this.login.name}`;
        this.logger('info', callName);
        const isProviderIdValid = userInDb.providerId === userSerialized.providerId;

        if (!isProviderIdValid) HttpRequestErrors.throwError('email-already-exist', '/register');

        return { ...userInDb, token: JWTGenerator.generate(userInDb) } as RegisterUserResponse;
    }

    public async serialize(payload: Google.Profile | Discord.Profile): Promise<__UserSerialized> {
        const callName = `[${this.constructor.name}] - ${this.serialize.name}`;
        this.logger('info', callName);
        const userExternalSerialized = this.serializer.externalUser(payload);

        const userSerialized = this.serializer.postUser(userExternalSerialized);
        const userDetailsSerialized = this.serializer.postUserDetails({});

        return { userSerialized, userDetailsSerialized };
    }

    public async enrichment({ user, userDetails }: __FullUser, _provider: string): Promise<__UserEnriched> {
        const callName = `[${this.constructor.name}] - ${this.enrichment.name}`;
        this.logger('info', callName);
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = 'oauth';
        user.twoFactorSecret = { active: false, qrcode: '', secret: '' };
        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_COMPLETE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusMustBe: InProgressStatusEnum.enum.WAIT_TO_COMPLETE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        return {
            userEnriched: user,
            userDetailsEnriched: userDetails,
        };
    }

    public async saveUser({ user, userDetails }: __FullUser): Promise<__UserSaved> {
        const callName = `[${this.constructor.name}] - ${this.saveUser.name}`;
        this.logger('info', callName);
        const userSaved = await this.usersRepository.create({
            ...user,
            userId: newUUID(),
        });

        const userDetailsSaved = await this.userDetailsRepository.create({
            ...userDetails,
            userId: userSaved.userId,
            userDetailId: newUUID(),
        });

        this.logger('info', 'User saved on database');
        this.logger('info', 'User details saved on database');

        return { userSaved, userDetailsSaved };
    }
}
