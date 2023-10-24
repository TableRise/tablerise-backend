import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema'
import { UserInstance, UserLogin } from 'src/domains/user/schemas/usersValidationSchema'
import { RegisterUserPayload, emailUpdatePayload } from 'src/types/requests/Payload'


const userMock: UserInstance = {
    userId: '39dbb501-d973-4362-9005-fbc3750b83y8',
    providerId: '39dbb501-d973-4362-9005-fbc3750b83d3',
    inProgress: { status: 'wait_to_confirm', code: '1447ab' },
    email: 'user@email.com',
    password: 'secret-secret',
    nickname: 'userTop',
    tag: '#5547',
    picture: 'https://imgbb.com',
    twoFactorSecret: { secret: 'testCode', qrcode: 'test', active: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

const userDetailsMock: UserDetailInstance = {
    userDetailId: '6506646f2a3c5ad8d2fb7998',
    userId: '6506646f2a3c5ad8d2fb7983',
    firstName: 'John',
    lastName: 'Doe',
    pronoun: 'he/his',
    secretQuestion: {
        question: 'What does the fox say?',
        answer: 'kikiki'
    },
    birthday: '2000/10/10',
    gameInfo: {
        campaigns: [],
        characters: [],
        badges: []
    },
    biography: 'I do not have anything interesting to tell',
    role: 'user'
}

const userLoginMock: UserLogin = {
    email: 'email@email.com',
    password: 'secret-secret'
}

const userPayloadMock: RegisterUserPayload = {
    email: userMock.email,
    password: userMock.password,
    twoFactorSecret: { active: false },
    nickname: userMock.nickname,
    picture: userMock.picture as string,
    details: {
        firstName: userDetailsMock.firstName,
        lastName: userDetailsMock.lastName,
        pronoun: userDetailsMock.pronoun,
        secretQuestion: userDetailsMock.secretQuestion,
        birthday: userDetailsMock.firstName,
        gameInfo: userDetailsMock.gameInfo,
        biography: userDetailsMock.firstName,
        role: userDetailsMock.role
    }
}

const userUpdatePayloadMock = {
    nickname: userMock.nickname,
    picture: userMock.picture as string,
    details: {
        firstName: userDetailsMock.firstName,
        lastName: userDetailsMock.lastName,
        pronoun: userDetailsMock.pronoun,
        birthday: userDetailsMock.firstName,
        biography: userDetailsMock.firstName,
    }
}

const userEmailUpdateMock: emailUpdatePayload = {
    email: 'new-email@email.com'
}

export default {
    user: userMock,
    userDetails: userDetailsMock,
    userLogin: userLoginMock,
    userPayload: userPayloadMock,
    userUpdatePayload: userUpdatePayloadMock,
    userEmailUpdate: userEmailUpdateMock
}
