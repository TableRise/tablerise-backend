/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/promise-function-async */
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

export const authUserId = generateNewMongoID();

interface CustomRequester {
    post: (url: string) => supertest.Test;
    patch: (url: string) => supertest.Test;
    put: (url: string) => supertest.Test;
    delete: (url: string) => supertest.Test;
    get: (url: string) => supertest.Test;
}

const requester = (): CustomRequester => {
    const request = supertest(app);
    const token = jwt.sign(
        {
            userId: authUserId,
            providerId: null,
            username: 'test-user',
        },
        'secret'
    );
    const bearer = `Bearer ${token}`;

    return {
        post: (url: string) => request.post(url).set('Authorization', bearer),
        patch: (url: string) => request.patch(url).set('Authorization', bearer),
        put: (url: string) => request.put(url).set('Authorization', bearer),
        delete: (url: string) => request.delete(url).set('Authorization', bearer),
        get: (url: string) => request.get(url).set('Authorization', bearer),
    };
};

export default requester;
