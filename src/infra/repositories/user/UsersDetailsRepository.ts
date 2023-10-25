import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { UpdateObj } from 'src/types/Repository';
import { UsersDetailsRepositoryContract } from 'src/types/contracts/users/repositories/usersDetailsRepository';

export default class UsersDetailsRepository {
    private readonly _model;
    private readonly _serializer;
    private readonly _logger;

    constructor({ database, serializer, logger }: UsersDetailsRepositoryContract) {
        this._model = database.modelInstance('user', 'UserDetails');
        this._serializer = serializer;
        this._logger = logger;
    }

    private _formatAndSerializeData(data: UserDetailInstance): UserDetailInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this._serializer.postUserDetails(format);
    }

    public async create(payload: UserDetailInstance): Promise<UserDetailInstance> {
        this._logger('info', `Create - UsersDetailsRepository`);
        const request = await this._model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserDetailInstance[]> {
        this._logger('info', `Find - UsersDetailsRepository`);
        const request = await this._model.findAll(query);

        if (!request.length) HttpRequestErrors.throwError('query-fail');

        return request.map((entity: UserDetailInstance) =>
            this._formatAndSerializeData(entity)
        );
    }

    public async findOne(id: string): Promise<UserDetailInstance> {
        this._logger('info', `FindOne - UsersDetailsRepository - Params: ${id}`);

        const request = await this._model.findOne({ userDetailId: id });

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async update({ id, payload }: UpdateObj): Promise<UserDetailInstance> {
        this._logger('info', `Update - UsersDetailsRepository - Params: ${id}`);

        const request = await this._model.update({ userDetailId: id }, payload);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async delete(id: string): Promise<void> {
        this._logger('warn', `Delete - UsersDetailsRepository - Params: ${id}`);
        await this._model.delete({ userDetailId: id });
    }
}
