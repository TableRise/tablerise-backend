import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateObj } from 'src/types/shared/repository';

export default class CharactersRepository {
    private readonly _model;
    private readonly _serializer;
    private readonly _updateTimestampRepository;
    private readonly _logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['CharactersRepositoryContract']) {
        this._updateTimestampRepository = updateTimestampRepository;
        this._serializer = serializer;
        this._model = database.modelInstance('characterDnd', 'CharactersDnd');
        this._logger = logger;
    }

    private _formatAndSerializeData(data: CharacterInstance): CharacterInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this._serializer.postCharacter(format);
    }

    public async create(payload: CharacterInstance): Promise<CharacterInstance> {
        this._logger('warn', `Create - CharactersRepository`);
        const request = await this._model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async findOne(query: any = {}): Promise<CharacterInstance> {
        this._logger('warn', 'FindOne - CharactersRepository');
        const request = await this._model.findOne(query);

        if (!request) HttpRequestErrors.throwError('character-does-not-exist');

        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<CharacterInstance[]> {
        this._logger('warn', `Find - CharactersRepository`);
        const request = await this._model.findAll(query);

        return request.map((data: CharacterInstance) => this._formatAndSerializeData(data));
    }

    public async update({ query, payload }: UpdateObj): Promise<CharacterInstance> {
        this._logger('warn', 'Update - CharactersRepository');

        const request = await this._model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('character-does-not-exist');

        await this._updateTimestampRepository.updateTimestamp(query);

        return this._formatAndSerializeData(request);
    }
}
