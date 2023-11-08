import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import newUUID from 'src/infra/helpers/user/newUUID';
import { UpdateObj } from 'src/types/users/Repository';
import { UsersRepositoryContract } from 'src/types/users/contracts/repositories/usersRepository';

export default class UsersRepository {
    private readonly _model;
    private readonly _updateTimestampRepository;
    private readonly _serializer;
    private readonly _logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: UsersRepositoryContract) {
        this._updateTimestampRepository = updateTimestampRepository;
        this._model = database.modelInstance('user', 'Users');
        this._serializer = serializer;
        this._logger = logger;
    }

    private _formatAndSerializeData(data: UserInstance): UserInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this._serializer.postUser(format);
    }

    public async create(payload: UserInstance): Promise<UserInstance> {
        this._logger('info', `Create - UsersRepository`);

        payload.userId = newUUID();

        const request = await this._model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserInstance[]> {
        this._logger('info', `Find - UsersRepository`);
        const request = await this._model.findAll(query);

        return request.map((entity: UserInstance) =>
            this._formatAndSerializeData(entity)
        );
    }

    public async findOne(query: any = {}): Promise<UserInstance> {
        this._logger('info', 'FindOne - UsersRepository');
        const request = await this._model.findOne(query);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<UserInstance> {
        this._logger('info', 'Update - UsersRepository');

        const request = await this._model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        await this._updateTimestampRepository.updateTimestamp(query);

        return this._formatAndSerializeData(request);
    }

    public async delete(query: any): Promise<void> {
        this._logger('warn', 'Delete - UsersRepository');
        await this._model.delete(query);
    }
}
