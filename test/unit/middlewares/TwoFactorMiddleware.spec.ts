import { Request, Response, NextFunction } from 'express';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import TwoFactorMiddleware, { modelUser } from 'src/middlewares/TwoFactorMiddleware';
import speakeasy from 'speakeasy';
import { User } from 'src/schemas/user/usersValidationSchema';
import GeneralDataFaker, { UserFaker } from '../../support/datafakers/GeneralDataFaker';

jest.mock('qrcode', () => ({
    toDataURL: () => '',
}));

describe('Middlewares :: TwoFactorMiddleware', () => {
    let user: User, updatedInProgressToDone: User;

    const request = {} as Request;
    const response = {} as Response;
    let next: NextFunction;

    beforeAll(() => {
        user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
            delete user._id;
            delete user.tag;
            delete user.providerId;
            delete user.inProgress;

            return user;
        })[0];
    });

    describe('When a request is made for verify two factor auth - success', () => {
        beforeAll(() => {
            jest.spyOn(modelUser, 'findOne').mockResolvedValue(user);
            jest.spyOn(modelUser, 'update').mockResolvedValue(updatedInProgressToDone);
            jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
            next = jest.fn();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should be successfull if is a valid code', async () => {
            request.query = { code: '123456' };
            request.params = { id: '123456789123456789123456' };
            await TwoFactorMiddleware(request, response, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('and the params are incorrect - userId', () => {
        beforeAll(() => {
            jest.spyOn(modelUser, 'findOne').mockResolvedValue(null);
        });

        it('should throw 404 error - Not Found', async () => {
            try {
                request.query = { code: '123456' };
                request.params = { id: '' };
                await TwoFactorMiddleware(request, response, next);

                expect('it should not be here').toBe(true);
            } catch (error) {
                const err = error as HttpRequestErrors;

                expect(err.message).toStrictEqual('User does not exist');
                expect(err.name).toBe('NotFound');
                expect(err.code).toBe(404);
            }
        });

        describe('and the two factor auth is deactivated', () => {
            beforeAll(() => {
                const { twoFactorSecret, ...userWithoutTwoFactor } = user;
                jest.spyOn(modelUser, 'findOne').mockResolvedValue(userWithoutTwoFactor);
                next = jest.fn();
            });

            it('should call next', async () => {
                request.params = { id: '123456789123456789123456' };
                await TwoFactorMiddleware(request, response, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('and the params are incorrect - code', () => {
            beforeAll(() => {
                jest.spyOn(modelUser, 'findOne').mockResolvedValue(user);
                jest.spyOn(modelUser, 'update').mockResolvedValue(updatedInProgressToDone);
                jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(false);
            });

            it('should throw 401 error - Wrong code', async () => {
                try {
                    request.query = { code: '123456' };
                    request.params = { id: '123456789123456789123456' };
                    await TwoFactorMiddleware(request, response, next);
                    expect('it should not be here').toBe(true);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).toStrictEqual('Two factor code does not match');
                    expect(err.name).toBe('Unauthorized');
                    expect(err.code).toBe(401);
                }
            });
        });

        it('should throw 400 error - Invalid type of code', async () => {
            try {
                request.query = { code: ['123456'] };
                request.params = { id: '123456789123456789123456' };
                await TwoFactorMiddleware(request, response, next);
                expect('it should not be here').toBe(true);
            } catch (error) {
                const err = error as HttpRequestErrors;

                expect(err.message).toStrictEqual('Query must be a string');
                expect(err.name).toBe('BadRequest');
                expect(err.code).toBe(400);
            }
        });
    });
});
