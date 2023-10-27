import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import getErrorName from 'src/services/helpers/getErrorName';
import { ErrorTypes } from 'src/types/Errors';

describe('Services :: Helpers :: HttpRequestErrors', () => {
    describe('When throw class', () => {
        it('should throw error', () => {
            try {
                throw new HttpRequestErrors({
                    message: 'test error',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('test error');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });
    });

    describe('When throw defined errors', () => {
        it('should throw error - email', () => {
            try {
                HttpRequestErrors.throwError('email-already-exist');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Email already exists in database');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - tag', () => {
            try {
                HttpRequestErrors.throwError('tag-already-exist');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('User with this tag already exists in database');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - user', () => {
            try {
                HttpRequestErrors.throwError('user-inexistent');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('User does not exist');
                expect(err.code).toBe(HttpStatusCode.NOT_FOUND);
                expect(err.name).toBe(getErrorName(HttpStatusCode.NOT_FOUND));
            }
        });

        it('should throw error - 2fa', () => {
            try {
                HttpRequestErrors.throwError('2fa-no-active');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('2FA not enabled for this user');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - 2fa exists', () => {
            try {
                HttpRequestErrors.throwError('2fa-already-active');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('2FA is already enabled for this user');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - 2fa-incorrect', () => {
            try {
                HttpRequestErrors.throwError('2fa-incorrect');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Two factor code does not match');
                expect(err.code).toBe(HttpStatusCode.UNAUTHORIZED);
                expect(err.name).toBe(getErrorName(HttpStatusCode.UNAUTHORIZED));
            }
        });

        it('should throw error - rpg-not-found-id', () => {
            try {
                HttpRequestErrors.throwError('rpg-not-found-id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe(ErrorMessage.NOT_FOUND_BY_ID);
                expect(err.code).toBe(HttpStatusCode.NOT_FOUND);
                expect(err.name).toBe(getErrorName(HttpStatusCode.NOT_FOUND));
            }
        });

        it('should throw error - query-string', () => {
            try {
                HttpRequestErrors.throwError('query-string-incorrect');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Query must be a string');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - verification-email', () => {
            try {
                HttpRequestErrors.throwError('verification-email-send-fail');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Some problem ocurred in email sending');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - invalid-user-status', () => {
            try {
                HttpRequestErrors.throwError('invalid-user-status');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('User status is invalid to perform this operation');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });

        it('should throw error - internal', () => {
            try {
                HttpRequestErrors.throwError(null as unknown as ErrorTypes);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('Some error not specified ocurred');
                expect(err.code).toBe(HttpStatusCode.INTERNAL_SERVER);
                expect(err.name).toBe('InternalServerError');
            }
        });

        it('should throw - blank-question-or-answer', () => {
            try {
                HttpRequestErrors.throwError('blank-question-or-answer');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err).toBeInstanceOf(HttpRequestErrors);
                expect(err.message).toBe('SecretQuestion has a blank question or answer');
                expect(err.code).toBe(HttpStatusCode.BAD_REQUEST);
                expect(err.name).toBe(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });
    });
});
