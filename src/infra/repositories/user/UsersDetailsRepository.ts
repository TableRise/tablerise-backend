import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class UsersDetailsRepository {
    private readonly _model;
    private readonly _updateTimestampRepository;
    private readonly _serializer;
    private readonly _logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['usersDetailsRepositoryContract']) {
        this._updateTimestampRepository = updateTimestampRepository;
        this._model = database.modelInstance('user', 'UserDetails');
        this._serializer = serializer;
        this._logger = logger;
    }

    private formatAndSerializeData(data: UserDetail): UserDetail {
        const format = JSON.parse(JSON.stringify(data));
        return this._serializer.postUserDetails(format);
    }

    public async create(payload: UserDetail): Promise<UserDetail> {
        this._logger('warn', `Create - UsersDetailsRepository`);

        payload.userDetailId = newUUID();

        const request = await this._model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserDetail[]> {
        this._logger('warn', `Find - UsersDetailsRepository`);
        const request = await this._model.findAll(query);

        return request.map((entity: UserDetail) => this.formatAndSerializeData(entity));
    }

    public async findOne(query: any = {}): Promise<UserDetail> {
        this._logger('warn', 'FindOne - UsersDetailsRepository');
        const request = await this._model.findOne(query);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        return this.formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<UserDetail> {
        this._logger('warn', 'Update - UsersDetailsRepository');
        const request = await this._model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        await this._updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }

    public async delete(query: any): Promise<void> {
        this._logger('warn', 'Delete - UsersDetailsRepository');
        await this._model.delete(query);
    }
}
