import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import Mock from 'src/types/Mock';

const realmInstanceEn: Realm = {
    name: 'Neverland',
    description: 'A beautiful land full of magic',
    thumbnail: 'http://neverland.com/picture.jpg',
};

const realmInstancePt: Realm = {
    name: 'Neverland',
    description: 'Uma terra linda e cheia de magia',
    thumbnail: 'http://neverland.com/picture.jpg',
};

const realm: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: realmInstanceEn,
        pt: realmInstancePt,
    },
    description: 'Mock an instance of a RPG realm',
};

export default realm;
