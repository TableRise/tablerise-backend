import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import FriendsService from 'src/core/users/services/users/FriendsService';

describe('Core :: Users :: Services :: Users :: FriendsService', () => {
    const logger = (): void => {};

    it('should award xp to both users and apply friend badge bonuses on acceptance', async () => {
        const accepter = DomainDataFaker.generateUsersJSON()[0];
        const requester = DomainDataFaker.generateUsersJSON()[0];
        const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        accepterDetails.userId = accepter.userId;
        requesterDetails.userId = requester.userId;
        accepterDetails.friends = [
            {
                userId: requester.userId,
                nickname: requester.nickname,
                tag: requester.tag,
                picture: requester.picture?.link ?? '',
                rank: requesterDetails.rank,
                status: 'pending',
                favorite: false,
            },
        ] as any;
        requesterDetails.friends = [];
        accepterDetails.gameInfo.playersAdded = 4;
        requesterDetails.gameInfo.playersAdded = 4;
        accepterDetails.gameInfo.badges = [];
        requesterDetails.gameInfo.badges = [];

        const usersDetailsRepository = {
            findOne: sinon.stub().callsFake(async ({ userId }) => {
                if (userId === accepter.userId) return accepterDetails;
                if (userId === requester.userId) return requesterDetails;
                return null;
            }),
            update: sinon.stub().resolves(),
        };

        const service = new FriendsService({
            usersRepository: {
                findOne: sinon.stub().resolves(accepter),
            },
            usersDetailsRepository,
            logger,
        } as any);

        await service.answerRequest({
            userId: accepter.userId,
            targetUserId: requester.userId,
        });

        expect(accepterDetails.xp).to.equal(500);
        expect(requesterDetails.xp).to.equal(500);
        expect(accepterDetails.gameInfo.badges).to.include('friends');
        expect(requesterDetails.gameInfo.badges).to.include('friends');
        expect(usersDetailsRepository.update).to.have.been.calledTwice();
    });

    it('should keep rank driven by xp even when friend badges push total badges to 20+', async () => {
        const accepter = DomainDataFaker.generateUsersJSON()[0];
        const requester = DomainDataFaker.generateUsersJSON()[0];
        const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        accepterDetails.userId = accepter.userId;
        requesterDetails.userId = requester.userId;
        accepterDetails.friends = [
            {
                userId: requester.userId,
                nickname: requester.nickname,
                tag: requester.tag,
                picture: requester.picture?.link ?? '',
                rank: requesterDetails.rank,
                status: 'pending',
                favorite: false,
            },
        ] as any;
        requesterDetails.friends = [];
        accepterDetails.gameInfo.playersAdded = 34;
        requesterDetails.gameInfo.playersAdded = 34;
        accepterDetails.gameInfo.badges = Array.from({ length: 17 }, (_, index) => `badge-${index}`);
        requesterDetails.gameInfo.badges = Array.from({ length: 17 }, (_, index) => `badge-${index}`);
        accepterDetails.xp = 0;
        requesterDetails.xp = 0;
        accepterDetails.rank = 'bronze';
        requesterDetails.rank = 'bronze';

        const usersDetailsRepository = {
            findOne: sinon.stub().callsFake(async ({ userId }) => {
                if (userId === accepter.userId) return accepterDetails;
                if (userId === requester.userId) return requesterDetails;
                return null;
            }),
            update: sinon.stub().resolves(),
        };

        const service = new FriendsService({
            usersRepository: {
                findOne: sinon.stub().resolves(accepter),
            },
            usersDetailsRepository,
            logger,
        } as any);

        await service.answerRequest({
            userId: accepter.userId,
            targetUserId: requester.userId,
        });

        expect(accepterDetails.gameInfo.badges).to.have.length(20);
        expect(requesterDetails.gameInfo.badges).to.have.length(20);
        expect(accepterDetails.rank).to.equal('bronze');
        expect(requesterDetails.rank).to.equal('bronze');
    });
});
