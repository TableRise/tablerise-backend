import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';

export default class CharacterAutomationBuilders {
    static automateCharacterAbilityScores(character: CharactersDnd, dndRulesRaces: Race): CharactersDnd {
        const abilityScoreIncreaseKeys = dndRulesRaces.abilityScoreIncrease.map((ability) => ability.name);

        abilityScoreIncreaseKeys.forEach((abilitykey) => {
            const characterFieldRacesAbilityScore = character.data.stats.abilityScores.findIndex(
                (ability) => ability.ability.toLowerCase() === abilitykey.toLowerCase()
            );
            const rulesFieldRacesAbilityScore = dndRulesRaces.abilityScoreIncrease.findIndex(
                (ability) => ability.name.toLowerCase() === abilitykey.toLowerCase()
            );

            character.data.stats.abilityScores[characterFieldRacesAbilityScore].value +=
                dndRulesRaces.abilityScoreIncrease[rulesFieldRacesAbilityScore].value;
        });

        return character;
    }
}
