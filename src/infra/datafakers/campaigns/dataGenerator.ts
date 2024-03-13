import { faker } from '@faker-js/faker';

export default {
    title: faker.company.catchPhrase,
    description: faker.company.buzzPhrase,
    visibility: faker.helpers.arrayElement(['hidden', 'visible']),
    system: faker.helpers.arrayElement(['d&d5e']),
    ageRestriction: faker.number.int({ min: 1, max: 18 }),
};
