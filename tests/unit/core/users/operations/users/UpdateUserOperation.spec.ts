import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import UpdateUserOperation from 'src/core/users/operations/users/UpdateUserOperation';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Operations :: UpdateUserOperation', () => {
    let updateUserOperation: UpdateUserOperation,
        usersSchema: any,
        schemaValidator: any,
        updateUserService: any,
        userWithouDetails: any,
        userUpdated: any;

    const logger = (): void => {};

    context('When a new user is updated with success', () => {
        before(() => {
            usersSchema = {
                userZod: {},
                userDetailZod: {},
            };

            schemaValidator = { entry: sinon.spy(() => {}) };

            userWithouDetails = DomainDataFaker.generateUsersJSON()[0];

            userUpdated = {
                ...userWithouDetails,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            updateUserService = {
                update: sinon.spy(() => ({
                    user: {},
                    userDetails: {},
                })),
                save: sinon.spy(() => userUpdated),
                _validateUpdateData: sinon.spy(() => {}),
            };

            updateUserOperation = new UpdateUserOperation({
                usersSchema,
                schemaValidator,
                updateUserService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await updateUserOperation.execute({
                userId: '123',
                payload: userUpdated,
            });

            expect(schemaValidator.entry).to.have.been.called(2);
            expect(updateUserService.save).to.have.been.called();
            expect(updateUserService.update).to.have.been.calledWith({
                userId: '123',
                payload: userUpdated,
            });
            expect(updateUserService.save).to.have.been.calledWith({
                user: {},
                userDetails: {},
            });
            expect(userTest).to.be.deep.equal(userUpdated);
        });
    });

    context('When a new user update fails', () => {
        before(() => {
            usersSchema = {
                userZod: {},
                userDetailZod: {},
            };

            schemaValidator = { entry: sinon.stub() };

            schemaValidator.entry.onCall(0).callsFake(() => {
                throw new HttpRequestErrors({
                    message: 'Schema error',
                    name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                    code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                    details: [
                        {
                            attribute: 'nickname',
                            path: 'payload',
                            reason: 'Required',
                        },
                    ],
                });
            });

            userWithouDetails = DomainDataFaker.generateUsersJSON()[0];

            userUpdated = {
                ...userWithouDetails,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            updateUserService = {
                update: sinon.spy(() => ({
                    user: {},
                    userDetails: {},
                })),
                save: sinon.spy(() => userUpdated),
                _validateUpdateData: sinon.spy(() => {}),
            };

            updateUserOperation = new UpdateUserOperation({
                usersSchema,
                schemaValidator,
                updateUserService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await updateUserOperation.execute({
                    userId: '123',
                    payload: userUpdated,
                });
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');
                expect(err.details[0].attribute).to.be.equal('nickname');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
