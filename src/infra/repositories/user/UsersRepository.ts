import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { UpdateObj } from 'src/types/Repository';
import { UsersRepositoryContract } from 'src/types/contracts/users/repositories/usersRepository';

export default class UsersRepository {
    private readonly _model;
    private readonly _serializer;
    private readonly _logger;

    constructor({ database, serializer, logger }: UsersRepositoryContract) {
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
        const request = await this._model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserInstance[]> {
        this._logger('info', `Find - UsersRepository`);
        const request = await this._model.findAll(query);

        return request.map((entity: UserInstance) => this._formatAndSerializeData(entity));
    }

    public async findOne(id: string): Promise<UserInstance> {
        this._logger('info', `FindOne - UsersRepository - Params: ${id}`);

        const request = await this._model.findOne({ userId: id });

        if (!request)
            HttpRequestErrors.throwError('user-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async update({ id, payload }: UpdateObj): Promise<UserInstance> {
        this._logger('info', `Update - UsersRepository - Params: ${id}`);

        const request = await this._model.update({ userId: id }, payload);

        if (!request)
            HttpRequestErrors.throwError('user-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async delete(id: string): Promise<void> {
        this._logger('warn', `Delete - UsersRepository - Params: ${id}`);
        await this._model.delete({ userId: id });
    }
}
