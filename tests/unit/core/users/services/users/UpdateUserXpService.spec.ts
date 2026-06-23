import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import UpdateUserXpService from 'src/core/users/services/users/UpdateUserXpService';

describe('Core :: Users :: Services :: Users :: UpdateUserXpService', () => {
    const logger = (): void => {};

    it('should add xp and trigger the exact 777 badge rule once', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 1000;
        userDetails.rank = 'bronze';
        userDetails.gameInfo.badges = [];
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new UpdateUserXpService({
            usersDetailsRepository,
            logger,
        } as any);

        const updated = await service.update({
            userId: userDetails.userId,
            xp: 777,
        });

        expect(updated.xp).to.equal(2177);
        expect(updated.gameInfo.badges).to.include('donate_normal');
        expect(updated.rank).to.equal('bronze');
    });

    it('should not duplicate exact-match badges or badge xp when the badge already exists', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 50;
        userDetails.gameInfo.badges = ['donate_normal'];
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new UpdateUserXpService({
            usersDetailsRepository,
            logger,
        } as any);

        const updated = await service.update({
            userId: userDetails.userId,
            xp: 777,
        });

        expect(updated.xp).to.equal(827);
        expect(updated.gameInfo.badges.filter((badge) => badge === 'donate_normal')).to.have.length(1);
    });

    it('should derive rank from xp thresholds instead of badge count', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 11400;
        userDetails.rank = 'gold';
        userDetails.gameInfo.badges = Array.from({ length: 25 }, (_, index) => `badge-${index}`);
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new UpdateUserXpService({
            usersDetailsRepository,
            logger,
        } as any);

        const updated = await service.update({
            userId: userDetails.userId,
            xp: 100,
        });

        expect(updated.rank).to.equal('emerald');
    });
});
