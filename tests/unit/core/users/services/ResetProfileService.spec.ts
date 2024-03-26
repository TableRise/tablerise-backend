import sinon from 'sinon';
import ResetProfileService from 'src/core/users/services/users/ResetProfileService';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: ResetProfileService', () => {
    let resetProfileService: ResetProfileService,
        usersDetailsRepository: any,
        currentUserDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#reset', () => {
        const userId = newUUID();

        before(() => {
            currentUserDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            currentUserDetails.gameInfo.badges = ['123'];
            currentUserDetails.gameInfo.campaigns = ['123'];
            currentUserDetails.gameInfo.characters = ['123'];

            usersDetailsRepository = {
                findOne: sinon.spy(() => currentUserDetails),
                update: sinon.spy(),
            };

            resetProfileService = new ResetProfileService({
                usersDetailsRepository,
                logger,
            });
        });

        it('should call correct methods', async () => {
            await resetProfileService.reset(userId);
            expect(usersDetailsRepository.findOne).to.have.been.called();
            expect(usersDetailsRepository.update).to.have.been.calledWith({
                query: { userDetailId: currentUserDetails.userDetailId },
                payload: currentUserDetails,
            });
        });
    });
});
