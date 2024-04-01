/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/promise-function-async */
import supertest from 'supertest';
import { container } from 'src/container';
import jwt from 'jsonwebtoken';

interface CustomRequester {
    post: (url: string) => supertest.Test & { _data: any };
    patch: (url: string) => supertest.Test & { _data: any };
    put: (url: string) => supertest.Test & { _data: any };
    delete: (url: string) => supertest.Test & { _data: any };
    get: (url: string) => supertest.Test & { _data: any };
}

const requester = (): CustomRequester => {
    const app = container.resolve('application').setupExpress();
    const request = supertest(app);
    const token = jwt.sign(
        {
            userId: '169d055c-a5e4-4334-a503-27d057188c0d',
            providerId: null,
            username: 'test-user',
        },
        'secret'
    );
    const tokenFormated = `token=${token}`;

    const req = {
        post: (url: string) =>
            request.post(url).set('Cookie', tokenFormated) as supertest.Test & {
                _data: any;
            },
        patch: (url: string) =>
            request.patch(url).set('Cookie', tokenFormated) as supertest.Test & {
                _data: any;
            },
        put: (url: string) =>
            request.put(url).set('Cookie', tokenFormated) as supertest.Test & {
                _data: any;
            },
        delete: (url: string) =>
            request.delete(url).set('Cookie', tokenFormated) as supertest.Test & {
                _data: any;
            },
        get: (url: string) =>
            request.get(url).set('Cookie', tokenFormated) as supertest.Test & {
                _data: any;
            },
    };

    return req;
};

export default requester;
