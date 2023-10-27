import DomainDataFaker from "src/infra/datafakers/users/DomainDataFaker";

const [user] = DomainDataFaker.generateUsersJSON();
const [details] = DomainDataFaker.generateUserDetailsJSON();

export default {
    email: user.email,
    password: user.password,
    twoFactorSecret: { active: false },
    nickname: user.nickname,
    picture: user.picture as string,
    details: {
        firstName: details.firstName,
        lastName: details.lastName,
        pronoun: details.pronoun,
        secretQuestion: details.secretQuestion,
        birthday: details.firstName,
        gameInfo: details.gameInfo,
        biography: details.firstName,
        role: details.role
    }
}
