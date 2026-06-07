import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import RegisterDonationService from 'src/core/users/services/users/RegisterDonationService';

describe('Core :: Users :: Services :: RegisterDonationService', () => {
    it('should send a donation validation email without persisting counters', async () => {
        const usersDetailsRepository = {
            findOne: sinon.stub(),
            update: sinon.stub(),
        };
        const emailSender = {
            type: 'common',
            send: sinon.stub().resolves({ success: true }),
        };

        const service = new RegisterDonationService({
            usersDetailsRepository,
            emailSender,
            logger: (): void => {},
        } as any);

        await service.register({
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            validation: true,
            payload: {
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                nickname: 'Lia',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            },
        });

        expect(emailSender.type).to.equal('donation');
        expect(emailSender.send).to.have.been.calledWith(
            {
                username: 'Lia',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                subject: 'Donation validation - TableRise',
            },
            'rwd.tablesrise.ttrpg@gmail.com'
        );
        expect(usersDetailsRepository.findOne).to.not.have.been.called();
        expect(usersDetailsRepository.update).to.not.have.been.called();
    });

    it('should require nickname when validation is true', async () => {
        const service = new RegisterDonationService({
            usersDetailsRepository: { findOne: sinon.stub(), update: sinon.stub() },
            emailSender: { type: 'common', send: sinon.stub() },
            logger: (): void => {},
        } as any);

        let thrownError;

        try {
            await service.register({
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                validation: true,
                payload: {
                    value: 15,
                    timestamp: '2026-06-03T12:30:00.000Z',
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                },
            });
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Nickname is required when validation is true');
        expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
    });

    it('should reject when route user id and payload user id do not match', async () => {
        const service = new RegisterDonationService({
            usersDetailsRepository: { findOne: sinon.stub(), update: sinon.stub() },
            emailSender: { type: 'common', send: sinon.stub() },
            logger: (): void => {},
        } as any);

        let thrownError;

        try {
            await service.register({
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                validation: false,
                payload: {
                    value: 15,
                    timestamp: '2026-06-03T12:30:00.000Z',
                    userId: '00000000-0000-0000-0000-000000000001',
                },
            });
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Route userId and payload userId must match');
        expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
    });

    it('should initialize donateAmount when missing, persist the new total, and award badges without duplicates', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        delete (userDetails.gameInfo as any).donateAmount;
        userDetails.gameInfo.badges = ['donate_normal'];

        const usersDetailsRepository = {
            findOne: sinon.stub().returns(userDetails),
            update: sinon.stub().resolves(userDetails),
        };
        const emailSender = {
            type: 'common',
            send: sinon.stub(),
        };

        const service = new RegisterDonationService({
            usersDetailsRepository,
            emailSender,
            logger: (): void => {},
        } as any);

        await service.register({
            userId: userDetails.userId,
            validation: false,
            payload: {
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: userDetails.userId,
            },
        });

        expect(userDetails.gameInfo.donateAmount).to.equal(15);
        expect(userDetails.gameInfo.badges.filter((badge) => badge === 'donate_normal')).to.have.length(1);
        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userId: userDetails.userId },
            payload: userDetails,
        });
    });

    it('should award higher donation badges and resync rank based on total badges', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.gameInfo.badges = Array.from({ length: 17 }, (_, index) => `existing-badge-${index}`);
        userDetails.gameInfo.donateAmount = 49;
        userDetails.rank = 'bronze';

        const usersDetailsRepository = {
            findOne: sinon.stub().returns(userDetails),
            update: sinon.stub().resolves(userDetails),
        };

        const service = new RegisterDonationService({
            usersDetailsRepository,
            emailSender: { type: 'common', send: sinon.stub() },
            logger: (): void => {},
        } as any);

        await service.register({
            userId: userDetails.userId,
            validation: false,
            payload: {
                value: 51,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: userDetails.userId,
            },
        });

        expect(userDetails.gameInfo.donateAmount).to.equal(100);
        expect(userDetails.gameInfo.badges).to.include.members(['donate_normal', 'donate_rare', 'donate_super_rare']);
        expect(userDetails.rank).to.equal('white');
    });

    it('should throw an external error when donation email sending fails', async () => {
        const service = new RegisterDonationService({
            usersDetailsRepository: { findOne: sinon.stub(), update: sinon.stub() },
            emailSender: { type: 'common', send: sinon.stub().resolves({ success: false }) },
            logger: (): void => {},
        } as any);

        let thrownError;

        try {
            await service.register({
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                validation: true,
                payload: {
                    value: 15,
                    timestamp: '2026-06-03T12:30:00.000Z',
                    nickname: 'Lia',
                    userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                },
            });
        } catch (error) {
            thrownError = error;
        }

        const err = thrownError as HttpRequestErrors;
        expect(err.message).to.equal('Some problem ocurred in email sending');
        expect(err.code).to.equal(HttpStatusCode.EXTERNAL_ERROR);
    });
});
