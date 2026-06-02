import { __FullUser, __UserEnriched, __UserSaved, __UserSerialized } from 'src/types/api/users/methods';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { TCreateUserBody } from 'src/interface/users/presentation/users/UsersSchemas';

export default class CreateUserService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly emailSender;
    private readonly serializer;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        usersRepository,
        logger,
        emailSender,
        serializer,
    }: UserCoreDependencies['createUserServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.emailSender = emailSender;
        this.serializer = serializer;
        this.logger = logger;

        this.enrichment = this.enrichment.bind(this);
        this.save = this.save.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    public async serialize(user: TCreateUserBody): Promise<__UserSerialized> {
        const callName = `[${this.constructor.name}] - ${this.serialize.name}`;
        this.logger('info', callName);
        const userSerialized = this.serializer.postUser(user);
        const userDetailsSerialized = this.serializer.postUserDetails({});

        const userInDb = await this.usersRepository.find({
            email: userSerialized.email,
        });

        if (userInDb.length) HttpRequestErrors.throwError('email-already-exist');

        return { userSerialized, userDetailsSerialized };
    }

    public async enrichment({ user, userDetails }: __FullUser): Promise<__UserEnriched> {
        const callName = `[${this.constructor.name}] - ${this.enrichment.name}`;
        this.logger('info', callName);
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagInDb = await this.usersRepository.find({
            tag,
            nickname: user.nickname,
        });

        if (tagInDb.length) HttpRequestErrors.throwError('tag-already-exist');

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            currentFlow: stateFlowsEnum.enum.CREATE_USER,
            prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };
        user.twoFactorSecret = { active: false, secret: '', qrcode: '' };
        user.picture = {
            link: 'https://i.ibb.co/gZSWpVM7/Chat-GPT-Image-23-de-mai-de-2026-14-04-30.png',
            title: '',
            id: '',
            deleteUrl: '',
            uploadDate: new Date().toISOString(),
            request: { success: true, status: 200 },
        };

        userDetails.firstName = '';
        userDetails.lastName = '';
        userDetails.biography = '';
        userDetails.birthday = '';
        userDetails.gameInfo = {
            campaigns: [],
            characters: [],
            badges: [],
            charactersCreatedAmount: 0,
            campaignsJoinedAmount: 0,
            campaignsCreatedAmount: 0,
            campaignsClosedAmount: 0,
            equipBoughtAmount: 0,
        };
        userDetails.role = 'user';
        userDetails.rank = 'bronze';

        return {
            userEnriched: user,
            userDetailsEnriched: userDetails,
        };
    }

    public async save({ user, userDetails }: __FullUser): Promise<__UserSaved> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);

        const userSaved = await this.usersRepository.create({
            ...user,
        });

        const userDetailsSaved = await this.usersDetailsRepository.create({
            ...userDetails,
            userId: userSaved.userId,
        });

        this.emailSender.type = 'confirmation';
        const emailSended = await this.emailSender.send(
            {
                username: userSaved.nickname,
                subject: 'Email de confirmação - TableRise',
            },
            userSaved.email
        );

        if (!emailSended.success) HttpRequestErrors.throwError('verification-email-send-fail');

        userSaved.inProgress.code = emailSended.verificationCode as string;

        await this.usersRepository.update({
            query: { userId: userSaved.userId },
            payload: userSaved,
        });

        return { userSaved, userDetailsSaved };
    }
}
