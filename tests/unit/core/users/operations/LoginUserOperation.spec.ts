import { CookieOptions } from 'express';
import sinon from 'sinon';
import LoginUserOperation from 'src/core/users/operations/users/LoginUserOperation';
import newUUID from 'src/domains/common/helpers/newUUID';
import { JWTResponse } from 'src/types/api/users/methods';

describe('Core :: Users :: Operations :: LoginUserOperation', () => {
    let loginUserOperation: LoginUserOperation,
        loginUserService: any,
        enrichedToken: JWTResponse,
        cookieData: CookieOptions;

    const logger = (): void => {};

    context('When a user is logged in', () => {
        context('And data is correct', () => {
            before(() => {
                enrichedToken = {
                    userId: newUUID(),
                    providerId: newUUID(),
                    username: 'JohnDoe#321',
                    picture: {
                        id: '',
                        link: '',
                        uploadDate: new Date(),
                    },
                    fullname: 'John Doe',
                };

                cookieData = {
                    maxAge: 3600000,
                    httpOnly: true,
                    secure: process.env.COOKIE_SECURE === 'yes',
                    sameSite: 'lax',
                };

                loginUserService = {
                    enrichToken: sinon.spy(() => enrichedToken),
                    setCookieOptions: sinon.spy(() => cookieData),
                };
                loginUserOperation = new LoginUserOperation({
                    loginUserService,
                    logger,
                });
            });

            it('should execute with success', async () => {
                const { tokenData, cookieOptions } = await loginUserOperation.execute(
                    '123'
                );

                expect(loginUserService.enrichToken).to.have.been.calledWith('123');
                expect(loginUserService.setCookieOptions).to.have.been.called();
                expect(tokenData).to.be.deep.equal(enrichedToken);
                expect(cookieOptions).to.be.deep.equal(cookieData);
            });
        });
    });
});
