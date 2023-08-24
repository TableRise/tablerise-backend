import { DnDRealm } from '@tablerise/database-management';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const realmInstanceEn: DnDRealm = {
    name: 'Neverland',
    description: 'A beautiful land full of magic',
    thumbnail: 'http://neverland.com/picture.jpg',
};

const realmInstancePt: DnDRealm = {
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
