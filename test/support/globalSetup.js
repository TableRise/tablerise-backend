const { default: DatabaseManagement } = require('@tablerise/database-management');
const Database = require('./Database').default;
const { authUserId } = require('./requester');
const utils = require('./utils').default;

const { dataGenerator } = utils;

async function setup() {
    const { User, UserDetails } = Database.models;

    await DatabaseManagement.connect(true);

    const user = {
        _id: authUserId,
        inProgress: { status: 'done', code: '' },
        providerId: null,
        email: dataGenerator.email(),
        password: '@Password61',
        nickname: dataGenerator.nickname(),
        tag: `#${dataGenerator.number({ min: 1000, max: 9999 })}`,
        picture: dataGenerator.picture(),
        twoFactorSecret: { active: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const details = {
        userId: authUserId,
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        pronoun: 'she/her',
        secretQuestion: { question: 'What sound does the fox?', answer: 'Kikikikikiu' },
        birthday: dataGenerator.birthday().toISOString(),
        gameInfo: { campaigns: [], characters: [], badges: [] },
        biography: dataGenerator.biography(),
        role: 'admin',
    };

    await User.create(user);
    await UserDetails.create(details);
}

module.exports = setup;
