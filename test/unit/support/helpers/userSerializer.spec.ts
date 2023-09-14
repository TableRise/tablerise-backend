import userSerializer from 'src/support/helpers/userSerializer';
import userProfileMocks from '../../../../src/support/mocks/user';

describe('Helpers :: userSerializer', () => {
    describe('When called', () => {
        it('should return the correct user data when the auth provider is Discord', () => {
            expect(userSerializer(userProfileMocks.discordProfile)).toEqual({
                external_id: '784950523351513502',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the auth provider is Google', () => {
            expect(userSerializer(userProfileMocks.googleProfile)).toEqual({
                external_id: '1128493523316590413556',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the auth provider is Facebook', () => {
            expect(userSerializer(userProfileMocks.facebookProfile)).toEqual({
                external_id: '6413033402083491',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });
    });
});
