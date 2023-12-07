import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { ErrorTypes } from 'src/types/users/Errors';

describe('Domains :: User :: Helpers :: HttpRequestErrors', () => {
    const expectedErrors: Record<ErrorTypes, string> = {
        unauthorized: 'Unauthorized',
        'email-already-exist': 'Email already exists in database',
        'tag-already-exist': 'User with this tag already exists in database',
        'user-inexistent': 'User does not exist',
        '2fa-no-active': '2FA not enabled for this user',
        '2fa-and-secret-question-no-active':
            '2FA not enabled for this user neither secretQuestion',
        '2fa-already-active': '2FA is already enabled for this user',
        '2fa-incorrect': 'Two factor code does not match',
        'rpg-not-found-id': 'NotFound an object with provided ID',
        'query-string-incorrect': 'Query must be a string',
        'query-missing': 'Query must not be empty',
        'invalid-user-status': 'User status is invalid to perform this operation',
        'invalid-email-verify-code': 'Invalid email verify code',
        'linked-mandatory-data-when-delete':
            'There is a campaing or character linked to this user',
        'verification-email-send-fail': 'Some problem ocurred in email sending',
        'user-database-critical-errror':
            'User database is not according with User Details database',
        'query-fail': 'Query was not found in database',
        'info-already-added': 'Info already added',
        'content-inexistent': 'This content do not exist in the RPG system',
        'incorrect-secret-question': 'Secret question is incorrect',
        'new-structure-secret-question-missing':
            'Structure of new for new question and answer is missing',
        'blank-question-or-answer': 'Some error not specified ocurred',
        login: 'Some error not specified ocurred',
        'linked-data': 'Some error not specified ocurred',
        'verification-email': 'Some error not specified ocurred',
    };

    it('Should throw an expected error', () => {
        for (const [key, value] of Object.entries(expectedErrors)) {
            expect(() => HttpRequestErrors.throwError(key as ErrorTypes)).to.throw(value);
        }
    });
});
