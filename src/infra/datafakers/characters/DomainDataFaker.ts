import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { CharacterJSONPayload } from 'src/types/modules/infra/datafakers/characters/DomainDataFaker';
import generateCharactersFaker from './generators/generateCharactersFaker';

function generateCharactersJSON(
    { count, characterId }: CharacterJSONPayload = { count: 1 }
): CharacterInstance[] {
    return generateCharactersFaker({ count, characterId });
}

const [character] = generateCharactersJSON();
const [characterToUpdate] = generateCharactersJSON();

delete character.data.profile.level;
delete character.data.profile.xp;
delete character.data.profile.characteristics.appearance.picture;
delete character.data.stats.abilityScores;
delete character.data.stats.skills;
delete character.data.stats.deathSaves;
delete character.data.money;
delete character.data.spells;
delete character.data.createdAt;
delete character.data.updatedAt;

delete character.data.profile.characteristics.appearance.picture;
delete character.data.profile.characteristics.alliesAndOrgs[0].symbol;
delete character.characterId;
// @ts-expect-error Remove requried prop to swagger schema
delete character.author;
delete character.campaignId;
delete character.matchId;
// @ts-expect-error Remove requried prop to swagger schema
delete character.npc;

const orgPictureUpload = {
    picture: { isBinary: true },
};

const mocks = {
    createCharacterMock: {
        data: character.data,
        npc: character.npc,
    },
    updateCharacterMock: characterToUpdate,
    orgPictureUpload,
};

export default {
    generateCharactersJSON,
    mocks,
};
