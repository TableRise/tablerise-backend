import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterAutomationBuilders from 'src/domains/characters/helpers/CharacterAutomationBuilders';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { CreateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import { RPGRulesDatabase } from 'src/types/shared/repository';

export default class CreateCharacterService {
    private readonly charactersRepository;
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly dungeonsAndDragonsRepository;
    private readonly serializer;
    private readonly logger;

    constructor({
        charactersRepository,
        usersRepository,
        usersDetailsRepository,
        dungeonsAndDragonsRepository,
        serializer,
        logger,
    }: CharacterCoreDependencies['createCharacterServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.serializer = serializer;
        this.logger = logger;

        this.serialize = this.serialize.bind(this);
    }

    private validateForbiddenKeys(payload: CharacterInstance): void {
        const isLevelPresent = payload.data.profile.level;
        const isXpPresent = payload.data.profile.xp;
        const isAbilityScoresPresent = payload.data.stats.abilityScores;
        const isDeathSavesPresent = payload.data.stats.deathSaves;
        const isMoneyPresent = payload.data.money;
        const isSpellsPresent = payload.data.spells;

        const forbiddenKeys = [
            isLevelPresent,
            isXpPresent,
            isAbilityScoresPresent,
            isDeathSavesPresent,
            isMoneyPresent,
            isSpellsPresent,
        ];

        const someExists = forbiddenKeys.some((forbidKeys) => forbidKeys !== undefined);

        if (someExists) HttpRequestErrors.throwError('save-forbidden-content');
    }

    public serialize(payload: CreateCharacterPayload): CharacterInstance {
        this.logger('info', 'Serialize - CreateCharacterService');
        const characterSerialized = this.serializer.postCharacter(payload.payload);

        this.validateForbiddenKeys(characterSerialized);

        return characterSerialized;
    }

    public async enrichment(payload: CharacterInstance, userId: string): Promise<CharactersDnd> {
        this.logger('info', 'Enrichment - CreateCharacterService');

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId });

        payload.author = {
            userId,
            nickname: userInDb.nickname,
            fullname: `${userDetailsInDb.firstName} ${userDetailsInDb.lastName}`,
        };

        payload.data.profile.level = 0;
        payload.data.profile.xp = 0;
        payload.data.stats.abilityScores = [
            {
                ability: 'strength',
                value: 0,
                modifier: 0,
                proficiency: false,
            },
            {
                ability: 'dexterity',
                value: 0,
                modifier: 0,
                proficiency: false,
            },
            {
                ability: 'constitution',
                value: 0,
                modifier: 0,
                proficiency: false,
            },
            {
                ability: 'intelligence',
                value: 0,
                modifier: 0,
                proficiency: false,
            },
            {
                ability: 'wisdom',
                value: 0,
                modifier: 0,
                proficiency: false,
            },
            {
                ability: 'charisma',
                value: 0,
                modifier: 0,
                proficiency: false,
            },
        ];
        payload.data.stats.deathSaves = {
            success: 0,
            failures: 0,
        };
        payload.data.money = {
            cp: 0,
            sp: 0,
            ep: 0,
            gp: 0,
            pp: 0,
        };
        payload.data.spells = {
            cantrips: [],
            1: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            2: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            3: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            4: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            5: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            6: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            7: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            8: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
            9: {
                spellIds: [],
                slotsTotal: 0,
                slotsExpended: 0,
            },
        };

        payload.data.stats.skills = {};
        payload.picture = null;
        payload.data.profile.characteristics.appearance.picture = null;
        payload.data.profile.characteristics.alliesAndOrgs[0].symbol = null;
        payload.data.createdAt = new Date().toISOString();
        payload.data.updatedAt = new Date().toISOString();
        payload.createdAt = new Date().toISOString();
        payload.updatedAt = new Date().toISOString();

        payload.logs = [
            {
                message: `Personagem criado com sucesso`,
                loggedAt: new Date().toISOString().split('T')[0],
            },
        ];

        return payload as CharactersDnd;
    }

    public async automation(character: CharactersDnd): Promise<CharactersDnd> {
        this.dungeonsAndDragonsRepository.setEntity('Races');

        const characterRace = character.data.profile.race;
        const dndRulesRaces = (await this.dungeonsAndDragonsRepository.findOne({
            'en.name': characterRace,
        })) as RPGRulesDatabase<Race>;

        const characterAbilityScoresAutomated = CharacterAutomationBuilders.automateCharacterAbilityScores(
            character,
            dndRulesRaces.en
        );

        character.data.stats.speed = dndRulesRaces.en.speed[0];
        character.data.profile.characteristics.other.languages.push(...dndRulesRaces.en.language);

        return characterAbilityScoresAutomated;
    }

    public async save(character: CharacterInstance): Promise<CharacterInstance> {
        this.logger('info', 'Save - CreateCharacterService');
        const characterId = newUUID();
        const userDetailsInDb = await this.usersDetailsRepository.findOne({
            userId: character.author.userId,
        });

        userDetailsInDb.gameInfo.characters.push(characterId);

        await this.usersDetailsRepository.update({
            query: { userId: character.author.userId },
            payload: userDetailsInDb,
        });

        character.characterId = characterId;

        return this.charactersRepository.create(character);
    }
}
