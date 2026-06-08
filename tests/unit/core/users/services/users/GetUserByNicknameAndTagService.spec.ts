import GetUserByNicknameAndTagService from 'src/core/users/services/users/GetUserByNicknameAndTagService';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { RegisterUserResponse } from 'src/types/api/users/http/response';

describe('Core :: Users :: Services :: GetUserByNicknameAndTagService', () => {
    let getUserByNicknameAndTagService: GetUserByNicknameAndTagService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: User,
        userDetails: UserDetail,
        userReturned: RegisterUserResponse;

    const logger = (): void => {};

    context('#Get', () => {
        context('When get user by nickname and tag with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userReturned = { ...user, details: userDetails };

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                getUserByNicknameAndTagService = new GetUserByNicknameAndTagService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const userTest = await getUserByNicknameAndTagService.get({
                    nickname: user.nickname,
                    tag: user.tag,
                });

                expect(userTest.details.userId).to.be.equal(userTest.userId);
                expect(userTest).to.be.deep.equal(userReturned);
            });
        });

        context('When get user by nickname and tag - but user is deleted', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;

                usersRepository = {
                    findOne: () => null,
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
                };

                getUserByNicknameAndTagService = new GetUserByNicknameAndTagService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw the same not found error', async () => {
                try {
                    await getUserByNicknameAndTagService.get({
                        nickname: user.nickname,
                        tag: user.tag,
                    });

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });

        context('When get user by nickname and tag - but details are deleted', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    findOne: () => user,
                };

                usersDetailsRepository = {
                    findOne: () => null,
                };

                getUserByNicknameAndTagService = new GetUserByNicknameAndTagService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw the same not found error', async () => {
                try {
                    await getUserByNicknameAndTagService.get({
                        nickname: user.nickname,
                        tag: user.tag,
                    });

                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });
});
