import { UserDetail } from "src/schemas/user/userDetailsValidationSchema"
import { User, UserLogin } from "src/schemas/user/usersValidationSchema"


const userMock: User = {
    inProgress: { status: 'wait_to_confirm', code: '1447ab' },
    providerId: '39dbb501-d973-4362-9005-fbc3750b83d3',
    email: 'user@email.com',
    password: 'secret-secret',
    nickname: 'userTop',
    tag: '#5547',
    picture: 'https://imgbb.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

const userDetailsMock: UserDetail = {
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

export default {
    user: userMock,
    userDetails: userDetailsMock,
    userLogin: userLoginMock
}
