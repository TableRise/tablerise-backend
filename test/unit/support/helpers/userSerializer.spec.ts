import userSerializer from 'src/support/helpers/userSerializer';
import { discordProfileMock, facebookProfileMock, googleProfileMock } from '../mocks/user/userProfiles';

describe('Helpers :: userSerializer', () => {
    describe('When called', () => {
        it('should return the correct user data when the auth provider is Discord', () => {
            expect(userSerializer(discordProfileMock)).toEqual({
                external_id: '784950523351513502',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the auth provider is Google', () => {
            expect(userSerializer(googleProfileMock)).toEqual({
                external_id: '1128493523316590413556',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });

        it('should return the correct user data when the auth provider is Facebook', () => {
            expect(userSerializer(facebookProfileMock)).toEqual({
                external_id: '6413033402083491',
                email: 'john_doe@test.com',
                name: 'John Doe',
            });
        });
    });
});
