import userSerializer, { postUserDetailsSerializer, postUserSerializer } from 'src/support/helpers/userSerializer';
import userProfileMocks from '../../../../src/support/mocks/user';

describe('Helpers :: userSerializer', () => {
    describe('When called', () => {
        it('should return the correct user data when the auth provider is Discord', () => {
            expect(userSerializer(userProfileMocks.discordProfile)).toEqual({
                providerId: '784950523351513502',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the auth provider is Google', () => {
            expect(userSerializer(userProfileMocks.googleProfile)).toEqual({
                providerId: '1128493523316590413556',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the auth provider is Facebook', () => {
            expect(userSerializer(userProfileMocks.facebookProfile)).toEqual({
                providerId: '6413033402083491',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the default user profile is generated', () => {
            expect(postUserSerializer({})).toStrictEqual({
                providerId: null,
                email: null,
                password: null,
                nickname: null,
                tag: null,
                picture: null,
                createdAt: null,
                updatedAt: null
            });
        });

        it('should return the correct user data when the default user details profile is generated', () => {
            expect(postUserDetailsSerializer({})).toStrictEqual({
                userId: null,
                firstName: null,
                lastName: null,
                pronoun: null,
                secretQuestion: null,
                birthday: null,
                gameInfo: { campaigns: [], characters: [], badges: [] },
                biography: null,
                role: 'user'
            })
        })
    });
});
