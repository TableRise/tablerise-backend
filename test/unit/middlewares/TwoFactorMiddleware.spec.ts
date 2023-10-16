import { Request, Response, NextFunction } from 'express';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import TwoFactorMiddleware from 'src/middlewares/TwoFactorMiddleware';
import speakeasy from 'speakeasy';
import { User } from 'src/schemas/user/usersValidationSchema';
import GeneralDataFaker, { UserFaker } from '../../support/datafakers/GeneralDataFaker';
import Database from '../../support/Database';
import logger from '@tablerise/dynamic-logger';

jest.mock('qrcode', () => ({
    toDataURL: () => '',
}));

describe('Middlewares :: TwoFactorMiddleware', () => {
    let user: User, updatedInProgressToDone: User, twoFactorMiddleware: TwoFactorMiddleware;

    const { User } = Database.models;

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

        twoFactorMiddleware = new TwoFactorMiddleware(User, logger);
    });

    describe('When a request is made for verify two factor auth - success', () => {
        beforeAll(() => {
            // @ts-expect-error Intentional error
            user.twoFactorSecret?.code = 'test';
            // @ts-expect-error Intentional error
            user.twoFactorSecret?.qrcode = 'test';
            jest.spyOn(User, 'findOne').mockResolvedValue(user);
            jest.spyOn(User, 'update').mockResolvedValue(updatedInProgressToDone);
            jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
            next = jest.fn();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should be successfull if is a valid token', async () => {
            request.query = { token: '123456' };
            request.params = { id: '123456789123456789123456' };
            await twoFactorMiddleware.authenticate(request, response, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('and the params are incorrect - userId', () => {
        beforeAll(() => {
            jest.spyOn(User, 'findOne').mockResolvedValue(null);
        });

        it('should throw 404 error - Not Found', async () => {
            try {
                request.query = { code: '123456' };
                request.params = { id: '' };
                await twoFactorMiddleware.authenticate(request, response, next);

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
                jest.spyOn(User, 'findOne').mockResolvedValue(userWithoutTwoFactor);
                next = jest.fn();
            });

            it('should call next', async () => {
                request.params = { id: '123456789123456789123456' };
                await twoFactorMiddleware.authenticate(request, response, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('and the params are incorrect - token', () => {
            beforeAll(() => {
                jest.spyOn(User, 'findOne').mockResolvedValue(user);
                jest.spyOn(User, 'update').mockResolvedValue(updatedInProgressToDone);
                jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(false);
            });

            it('should throw 401 error - Wrong token', async () => {
                try {
                    request.query = { token: '123456' };
                    request.params = { id: '123456789123456789123456' };
                    await twoFactorMiddleware.authenticate(request, response, next);
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
                await twoFactorMiddleware.authenticate(request, response, next);
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
