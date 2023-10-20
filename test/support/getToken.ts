import requester from './requester';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';

export default async function getToken({ email, password }: UserInstance): Promise<string> {
    const userLogin = await requester().post('/profile/login').send({ email, password }).expect(HttpStatusCode.OK);

    return userLogin.body.token;
}
