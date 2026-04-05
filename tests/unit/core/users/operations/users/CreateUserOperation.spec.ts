import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import sinon from 'sinon';
import CreateUserOperation from 'src/core/users/operations/users/CreateUserOperation';

describe('Core :: Users :: Operations :: CreateUserOperation', () => {
    let createUserOperation: CreateUserOperation,
        createUserService: any,
        userToCreate: any,
        userCreated: any;

    const logger = (): void => {};

    context('When a new user is created with success', () => {
        before(() => {
            userToCreate = DomainDataFaker.generateUsersJSON()[0];
            userCreated = {
                ...userToCreate,
                details: DomainDataFaker.generateUserDetailsJSON()[0],
            };

            createUserService = {
                serialize: sinon.spy(() => ({
                    userSerialized: {},
                    userDetailsSerialized: {},
                })),
                enrichment: sinon.spy(() => ({
                    userEnriched: {},
                    userDetailsEnriched: {},
                })),
                save: sinon.spy(() => ({
                    userSaved: userToCreate,
                    userDetailsSaved: userCreated.details,
                })),
            };

            createUserOperation = new CreateUserOperation({
                createUserService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const userTest = await createUserOperation.execute(userCreated);

            expect(createUserService.serialize).to.have.been.called();
            expect(createUserService.enrichment).to.have.been.calledWith({
                user: {},
                userDetails: {},
            });
            expect(createUserService.save).to.have.been.calledWith({
                user: {},
                userDetails: {},
            });
            expect(userTest).to.be.deep.equal(userCreated);
        });
    });
});
