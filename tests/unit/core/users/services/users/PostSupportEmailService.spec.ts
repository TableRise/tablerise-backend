import sinon from 'sinon';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import PostSupportEmailService from 'src/core/users/services/users/PostSupportEmailService';

describe('Core :: Users :: Services :: PostSupportEmailService', () => {
    let user: User;
    let userDetails: UserDetail;

    beforeEach(() => {
        process.env.EMAIL_FROM = 'TableRise <support@tablerise.com>';

        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
    });

    afterEach(() => {
        delete process.env.EMAIL_FROM;
    });

    it('should send support email with the full user name and campaign code', async () => {
        const usersRepository = {
            findOne: sinon.stub().returns(user),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub().returns(userDetails),
        };
        const emailSender = {
            type: 'common',
            send: sinon.stub().resolves({ success: true }),
        };

        const service = new PostSupportEmailService({
            usersRepository,
            usersDetailsRepository,
            emailSender,
            logger: (): void => {},
        } as any);

        await service.sendEmail({
            userId: user.userId,
            payload: {
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
            },
        });

        expect(emailSender.type).to.equal('support');
        expect(emailSender.send).to.have.been.calledWith(
            {
                username: `${userDetails.firstName} ${userDetails.lastName}`.trim(),
                userEmail: user.email,
                title: 'Nao consigo entrar',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
                body: 'Meu codigo nao chega.',
                subject: 'Solicitacao de suporte - TableRise',
                replyTo: user.email,
            },
            'TableRise <support@tablerise.com>'
        );
    });

    it('should fallback to nickname when user details names are undefined', async () => {
        (userDetails as any).firstName = undefined;
        (userDetails as any).lastName = undefined;

        const usersRepository = {
            findOne: sinon.stub().returns(user),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub().returns(userDetails),
        };
        const emailSender = {
            type: 'common',
            send: sinon.stub().resolves({ success: true }),
        };

        const service = new PostSupportEmailService({
            usersRepository,
            usersDetailsRepository,
            emailSender,
            logger: (): void => {},
        } as any);

        await service.sendEmail({
            userId: user.userId,
            payload: {
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
            },
        });

        expect(emailSender.send).to.have.been.calledWith(
            sinon.match({
                username: user.nickname,
                campaignCode: undefined,
            }),
            'TableRise <support@tablerise.com>'
        );
    });

    it('should throw an external error when email sending fails', async () => {
        const usersRepository = {
            findOne: sinon.stub().returns(user),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub().returns(userDetails),
        };
        const emailSender = {
            type: 'common',
            send: sinon.stub().resolves({ success: false }),
        };

        const service = new PostSupportEmailService({
            usersRepository,
            usersDetailsRepository,
            emailSender,
            logger: (): void => {},
        } as any);

        let thrownError;

        try {
            await service.sendEmail({
                userId: user.userId,
                payload: {
                    title: 'Nao consigo entrar',
                    content: 'Meu codigo nao chega.',
                    category: 'Autenticacao',
                },
            });
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Some problem ocurred in email sending');
        expect(err.code).to.equal(HttpStatusCode.EXTERNAL_ERROR);
    });

    it('should propagate repository errors when user data is missing', async () => {
        const usersRepository = {
            findOne: sinon.stub().callsFake(() => {
                HttpRequestErrors.throwError('user-inexistent');
            }),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub(),
        };
        const emailSender = {
            type: 'common',
            send: sinon.stub(),
        };

        const service = new PostSupportEmailService({
            usersRepository,
            usersDetailsRepository,
            emailSender,
            logger: (): void => {},
        } as any);

        let thrownError;

        try {
            await service.sendEmail({
                userId: user.userId,
                payload: {
                    title: 'Nao consigo entrar',
                    content: 'Meu codigo nao chega.',
                    category: 'Autenticacao',
                },
            });
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('User does not exist');
        expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
        expect(emailSender.send).to.not.have.been.called();
    });
});
