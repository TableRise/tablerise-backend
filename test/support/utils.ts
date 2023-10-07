import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

const newUUID = (): string => v4();
const dataGenerator = {
    email: faker.internet.email,
    nickname: faker.internet.userName,
    number: faker.number.int,
    picture: faker.internet.avatar,
    name: { first: faker.person.firstName, last: faker.person.lastName },
    birthday: faker.date.birthdate,
    biography: faker.person.bio,
};

export default {
    newUUID,
    dataGenerator,
};
