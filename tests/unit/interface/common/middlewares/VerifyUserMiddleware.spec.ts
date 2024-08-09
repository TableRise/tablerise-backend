import Sinon from 'sinon';
import { Express, Request, Response } from 'express';
import VerifyUserMiddleware from 'src/interface/common/middlewares/VerifyUserMiddleware';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Interface :: Common :: Middleware :: VerifyUserMiddleware', () => {
    let verifyUserMiddleware: VerifyUserMiddleware,
        user: UserInstance,
        usersRepository: any;

    const logger = (): void => {};

    context('#userStatus', () => {
        context('When the user has the status validated', () => {
            const response = {} as Response;
            const request = {} as Request;
            const next = Sinon.spy(() => {});

            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.status = 'done';

                usersRepository = {
                    findOne: () => user,
                };

                verifyUserMiddleware = new VerifyUserMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should call next function', async () => {
                request.user = { userId: '123' } as Express.User;
                await verifyUserMiddleware.userStatus(request, response, next);
                expect(next).to.have.been.called();
            });
        });

        context('When the user has the status validated - but is not done', () => {
            const response = {} as Response;
            const request = {} as Request;
            const next = Sinon.spy(() => {});

            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.status = 'wait_to_complete';

                usersRepository = {
                    findOne: () => user,
                };

                verifyUserMiddleware = new VerifyUserMiddleware({
                    usersRepository,
                    logger,
                });
            });

            it('should not call next function', async () => {
                try {
                    request.user = { userId: '123' } as Express.User;
                    await verifyUserMiddleware.userStatus(request, response, next);
                    expect('it should not be here').expect(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.details).to.deep.equal({
                        attribute: 'status',
                        path: user.inProgress.status,
                        reason: `Wrong status - ${user.inProgress.status}`,
                    });
                    expect(err.message).to.be.equal(
                        'User status is invalid to perform this operation'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });
    });
});
