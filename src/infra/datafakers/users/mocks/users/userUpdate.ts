import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

const [user] = DomainDataFaker.generateUsersJSON();
const [details] = DomainDataFaker.generateUserDetailsJSON();

export default {
    nickname: user.nickname,
    picture: user.picture as string,
    details: {
        firstName: details.firstName,
        lastName: details.lastName,
        pronoun: details.pronoun,
        birthday: details.firstName,
        biography: details.firstName,
    },
};
