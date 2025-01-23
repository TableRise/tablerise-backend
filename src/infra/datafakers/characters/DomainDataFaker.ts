import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { CharacterJSONPayload } from 'src/types/modules/infra/datafakers/characters/DomainDataFaker';
import generateCharactersFaker from './generators/generateCharactersFaker';

function generateCharactersJSON(
    { count, characterId }: CharacterJSONPayload = { count: 1 }
): CharacterInstance[] {
    return generateCharactersFaker({ count, characterId });
}

const [character] = generateCharactersJSON();

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

const mocks = {
    createCharacterMock: {
        data: character.data,
        NPC: character.NPC,
    },
};

export default {
    generateCharactersJSON,
    mocks,
};
