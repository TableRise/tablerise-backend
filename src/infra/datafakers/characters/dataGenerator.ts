import { faker } from '@faker-js/faker';

export default {
    email: faker.internet.email,
    nickname: faker.internet.userName,
    number: faker.number.int,
    picture: faker.internet.avatar,
    name: { first: faker.person.firstName, last: faker.person.lastName },
    birthday: faker.date.birthdate,
    biography: faker.person.bio,
    lorem: faker.lorem.paragraphs,
};
