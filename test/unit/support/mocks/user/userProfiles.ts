export const discordProfileMock = {
    id: '784950523351513502',
    username: 'John Doe',
    avatar: 'd7d76e8e63ewo37c20124f25870cb36',
    discriminator: '0',
    public_flags: 0,
    flags: 0,
    banner: null,
    accent_color: null,
    global_name: 'JohnDoe',
    avatar_decoration_data: null,
    banner_color: null,
    mfa_enabled: false,
    locale: 'pt-BR',
    premium_type: 0,
    email: 'john_doe@test.com',
    verified: true,
    provider: 'discord',
    accessToken: '1wrLh1PL619kjSnWidWlzZNGj',
    fetchedAt: '2023-09-13T00:19:09.852Z',
};

export const googleProfileMock = {
    id: '1128493523316590413556',
    displayName: 'John Doe',
    name: {
        familyName: 'Doe',
        givenName: 'John',
    },
    emails: [
        {
            value: 'john_doe@test.com',
            verified: true,
        },
    ],
    provider: 'google',
    _json: {
        sub: '1128493523316590413556',
        name: 'John Doe',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john_doe@test.com',
        email_verified: true,
        locale: 'pt-BR',
    },
};

export const facebookProfileMock = {
    id: '6413033402083491',
    displayName: 'John Doe',
    name: {
        familyName: 'Doe',
        givenName: 'John',
    },
    provider: 'facebook',
    _json: {
        id: '6413033402083491',
        name: 'John Doe',
        email: 'john_doe@test.com',
        first_name: 'John',
        last_name: 'Doe',
    },
};
