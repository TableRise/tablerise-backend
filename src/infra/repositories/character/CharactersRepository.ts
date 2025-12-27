import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateObj } from 'src/types/shared/repository';

export default class CharactersRepository {
    private readonly model;
    private readonly serializer;
    private readonly updateTimestampRepository;
    private readonly logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['CharactersRepositoryContract']) {
        this.updateTimestampRepository = updateTimestampRepository;
        this.serializer = serializer;
        this.model = database.modelInstance('characterDnd', 'CharactersDnd');
        this.logger = logger;
    }

    private formatAndSerializeData(data: CharacterInstance): CharacterInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postCharacter(format);
    }

    public async create(payload: CharacterInstance): Promise<CharacterInstance> {
        this.logger('warn', `Create - CharactersRepository`);
        const request = await this.model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async findOne(query: any = {}): Promise<CharacterInstance> {
        this.logger('warn', 'FindOne - CharactersRepository');
        const request = await this.model.findOne(query);

        if (!request) HttpRequestErrors.throwError('character-does-not-exist');

        return this.formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<CharacterInstance[]> {
        this.logger('warn', `Find - CharactersRepository`);
        const request = await this.model.findAll(query);

        return request.map((data: CharacterInstance) => this.formatAndSerializeData(data));
    }

    public async update({ query, payload }: UpdateObj): Promise<CharacterInstance> {
        this.logger('warn', 'Update - CharactersRepository');

        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('character-does-not-exist');

        await this.updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }
}
