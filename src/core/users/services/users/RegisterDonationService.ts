import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { awardDonationBadges } from 'src/domains/users/helpers/BadgeAwardHandler';
import { ensureGameInfoCounters } from 'src/domains/users/helpers/GameInfoCounters';
import { RegisterDonationPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

const DONATION_VALIDATION_TARGET = 'rwd.tablesrise.ttrpg@gmail.com';

export default class RegisterDonationService {
    private readonly usersDetailsRepository;
    private readonly emailSender;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        emailSender,
        logger,
    }: UserCoreDependencies['registerDonationServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.emailSender = emailSender;
        this.logger = logger;

        this.assertMatchingUserIds = this.assertMatchingUserIds.bind(this);
        this.assertValidationNickname = this.assertValidationNickname.bind(this);
        this.sendValidationEmail = this.sendValidationEmail.bind(this);
        this.register = this.register.bind(this);
    }

    private assertMatchingUserIds(routeUserId: string, payloadUserId: string): void {
        if (routeUserId !== payloadUserId) {
            throw new HttpRequestErrors({
                message: 'Route userId and payload userId must match',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }
    }

    private assertValidationNickname(validation: boolean, nickname?: string): void {
        if (validation && !nickname) {
            throw new HttpRequestErrors({
                message: 'Nickname is required when validation is true',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }
    }

    private async sendValidationEmail(payload: RegisterDonationPayload['payload']): Promise<void> {
        this.emailSender.type = 'donation';

        const emailSended = await this.emailSender.send(
            {
                username: payload.nickname,
                userId: payload.userId,
                value: payload.value,
                timestamp: payload.timestamp,
                subject: 'Donation validation - TableRise',
            },
            DONATION_VALIDATION_TARGET
        );

        if (!emailSended.success) HttpRequestErrors.throwError('verification-email-send-fail');
    }

    public async register({ userId, validation, payload }: RegisterDonationPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.register.name}`;
        this.logger('info', callName);

        this.assertMatchingUserIds(userId, payload.userId);
        this.assertValidationNickname(validation, payload.nickname);

        if (validation) {
            await this.sendValidationEmail(payload);
            return;
        }

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureGameInfoCounters(userDetails);

        const gameInfo = userDetails.gameInfo as UserDetail['gameInfo'] & { donateAmount: number };
        gameInfo.donateAmount += payload.value;

        awardDonationBadges(userDetails);

        await this.usersDetailsRepository.update({
            query: { userId },
            payload: userDetails,
        });
    }
}
