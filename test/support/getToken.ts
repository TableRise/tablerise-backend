import requester from './requester';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { User } from 'src/schemas/user/usersValidationSchema';

export default async function getToken({ email, password }: User): Promise<string> {
    const userLogin = await requester.post('/profile/login').send({ email, password }).expect(HttpStatusCode.OK);

    return userLogin.body.token;
}
