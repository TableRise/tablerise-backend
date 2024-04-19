import { faker } from '@faker-js/faker';

export default {
    title: faker.company.catchPhrase(),
    description: faker.company.buzzPhrase(),
    visibility: faker.helpers.arrayElement(['hidden', 'visible']),
    system: faker.helpers.arrayElement(['dnd5e']),
    ageRestriction: faker.number.int({ min: 1, max: 18 }),
    cover: {
        id: faker.string.uuid(),
        link: faker.internet.url(),
        uploadDate: faker.date.anytime().toISOString(),
    },
    campaignPlayers: [
        {
            userId: faker.string.uuid(),
            characterIds: [],
            role: faker.helpers.arrayElement([
                'admin_player',
                'dungeon_master',
                'player',
            ]),
            status: faker.helpers.arrayElement(['pending']),
        },
    ],
    matchData: {
        matchId: faker.string.uuid(),
        avatars: [],
        musics: [],
        mapImages: [],
        logs: [],
    },
    infos: {
        campaignAge: '1',
        matchDates: [],
        announcements: [],
        visibility: faker.helpers.arrayElement(['hidden', 'visible']),
    },
    lores: {
        playerCharacters: [],
        dungeonMasterCharacters: [],
        environments: [],
        mainHistory: [],
    },
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
};
