import { DnDEntities } from '@tablerise/database-management/dist/src/types/DatabaseEntities';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { UpdateObj } from 'src/types/users/Repository';
import { UsersRepositoryContract } from 'src/types/users/contracts/repositories/usersRepository';

export default class DungeonsAndDragonsRepository {
    private readonly _model;
    private readonly _logger;
    private _entity = 'none';

    constructor({ database, logger }: UsersRepositoryContract) {
        this._model = database.modelInstance;
        this._logger = logger;
    }

    public setEntity(entity: string): void {
        this._entity = entity;
    }

    private _formatAndSerializeData(data: unknown): unknown {
        const format = JSON.parse(JSON.stringify(data));
        const { _id, ...withoutMongoId } = format;
        return withoutMongoId;
    }

    public async find(query: any = {}): Promise<unknown[]> {
        this._logger('info', `Find - DungeonsAndDragonsRepository`);
        const model = this._model('dungeons&dragons5e', this._entity as DnDEntities);
        const request = await model.findAll(query);

        return request.map((entity: unknown) => this._formatAndSerializeData(entity));
    }

    public async findOne(query: any = {}): Promise<unknown> {
        this._logger('info', 'FindOne - DungeonsAndDragonsRepository');
        const model = this._model('dungeons&dragons5e', this._entity as DnDEntities);
        const request = await model.findOne(query);

        if (!request) HttpRequestErrors.throwError('content-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<unknown> {
        this._logger('info', 'Update - DungeonsAndDragonsRepository');
        const model = this._model('dungeons&dragons5e', this._entity as DnDEntities);
        const request = await model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('content-inexistent');

        return this._formatAndSerializeData(request);
    }
}
