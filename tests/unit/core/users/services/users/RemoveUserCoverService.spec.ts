import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import RemoveUserCoverService from 'src/core/users/services/users/RemoveUserCoverService';

describe('Core :: Users :: Services :: Users :: RemoveUserCoverService', () => {
    const logger = (): void => {};

    it('should null the cover and persist the user details', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().resolves(),
        };
        const service = new RemoveUserCoverService({
            usersDetailsRepository,
            logger,
        } as any);

        await service.remove({
            userId: userDetails.userId,
        });

        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
        expect(userDetails.cover).to.equal(null);
    });

    it('should throw when the user details do not exist', async () => {
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(null),
            update: sinon.stub(),
        };
        const service = new RemoveUserCoverService({
            usersDetailsRepository,
            logger,
        } as any);

        try {
            await service.remove({
                userId: 'missing-user',
            });
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('User does not exist');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(usersDetailsRepository.update).to.not.have.been.called();
        }
    });
});
