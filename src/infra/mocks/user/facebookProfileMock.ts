import Facebook from 'passport-facebook'

export const facebookProfileMock: Facebook.Profile = {
    id: '6413033402083491',
    displayName: 'John Doe',
    name: {
        familyName: 'Doe',
        givenName: 'John',
    },
    provider: 'facebook',
    birthday: '',
    _raw: '',
    _json: {
        id: '6413033402083491',
        name: 'John Doe',
        email: 'john_doe@test.com',
        first_name: 'John',
        last_name: 'Doe',
    },
};