import sinon from 'sinon';
import UpdatePasswordService from 'src/core/users/services/users/UpdatePasswordService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

describe('Core :: Users :: Services :: UpdatePasswordService', () => {
    let updatePasswordService: UpdatePasswordService,
        usersRepository: any,
        user: UserInstance,
        payload: any,
        httpRequestErrors: HttpRequestErrors;

    const logger = (): void => {};

    context('#update', () => {
        context('When update an user password with success', () => {
            beforeEach(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.inProgress.status = 'wait_to_verify';
                user.inProgress.code = '123456';

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => ({})),
                };

                payload = {
                    email: 'user@email.com',
                    code: '123456',
                    password: 'World#123',
                };

                updatePasswordService = new UpdatePasswordService({
                    usersRepository,
                    httpRequestErrors,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                await updatePasswordService.update(payload);

                expect(usersRepository.update).to.have.been.called();
            });
        });
    });
});
