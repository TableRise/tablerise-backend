import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CreateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class CreateCharacterService {
    private readonly charactersRepository;
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly serializer;
    private readonly logger;

    constructor({
        charactersRepository,
        usersRepository,
        usersDetailsRepository,
        serializer,
        logger,
    }: CharacterCoreDependencies['createCharacterServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.serializer = serializer;
        this.logger = logger;

        this.serialize = this.serialize.bind(this);
    }

    public serialize(payload: CreateCharacterPayload): CharactersDnd {
        const callName = `[${this.constructor.name}] - ${this.serialize.name}`;
        this.logger('info', callName);
        const characterSerialized = this.serializer.postCharacter(payload.payload);

        return characterSerialized as CharactersDnd;
    }

    public async enrichment(payload: CharactersDnd, userId: string): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.enrichment.name}`;
        this.logger('info', callName);

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId });
        if (!userInDb || !userDetailsInDb) HttpRequestErrors.throwError('user-inexistent');

        payload.author = {
            userId,
            nickname: userInDb.nickname,
            fullname: `${userDetailsInDb.firstName} ${userDetailsInDb.lastName}`,
        };

        payload.picture = {
            link: 'https://i.ibb.co/9DzRTQ6/Chat-GPT-Image-23-de-mai-de-2026-14-12-10.png',
            title: '',
            id: '',
            deleteUrl: '',
            uploadDate: new Date().toISOString(),
            request: { success: true, status: 200 },
        };
        payload.data.profile.characteristics.appearance.picture = null as unknown as ImageObject;
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

        return payload;
    }

    public async save(character: CharactersDnd): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        const characterId = newUUID();
        const userDetailsInDb = await this.usersDetailsRepository.findOne({
            userId: character.author.userId,
        });
        if (!userDetailsInDb) HttpRequestErrors.throwError('user-inexistent');

        userDetailsInDb.gameInfo.characters.push(characterId);

        await this.usersDetailsRepository.update({
            query: { userId: character.author.userId },
            payload: userDetailsInDb,
        });

        character.characterId = characterId;

        return this.charactersRepository.create(character);
    }
}
