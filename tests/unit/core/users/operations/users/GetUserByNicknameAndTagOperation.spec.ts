import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import GetUserByNicknameAndTagOperation from 'src/core/users/operations/users/GetUserByNicknameAndTagOperation';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

describe('Core :: Users :: Operations :: GetUserByNicknameAndTagOperation', () => {
    let getUserByNicknameAndTagOperation: GetUserByNicknameAndTagOperation,
        getUserByNicknameAndTagService: any,
        user: User,
        userReturned: RegisterUserResponse;

    const logger = (): void => {};

    context('When get user by nickname and tag with success', () => {
        before(() => {
            user = DomainDataFaker.generateUsersJSON()[0];

            userReturned = {
                ...user,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            userReturned.details.userId = user.userId;

            getUserByNicknameAndTagService = {
                get: sinon.spy(() => userReturned),
            };

            getUserByNicknameAndTagOperation = new GetUserByNicknameAndTagOperation({
                getUserByNicknameAndTagService,
                logger,
            });
        });

        it('should return the correct user', async () => {
            const userTest = await getUserByNicknameAndTagOperation.execute({
                nickname: user.nickname,
                tag: user.tag,
            });

            expect(getUserByNicknameAndTagService.get).to.have.been.called();
            expect(getUserByNicknameAndTagService.get).to.have.been.calledWith({
                nickname: user.nickname,
                tag: user.tag,
            });
            expect(userTest).to.be.deep.equal(userReturned);
        });
    });
});
