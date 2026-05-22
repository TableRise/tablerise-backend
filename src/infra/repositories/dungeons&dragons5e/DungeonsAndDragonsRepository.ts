import { DnDEntities } from '@tablerise/database-management/dist/src/types/DatabaseEntities';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UpdateObj } from 'src/types/shared/repository';
import { DungeonsAndDragonsRepositoryContract } from 'src/types/modules/infra/repositories/dungeons&dragons5e/dungeonsAndDragonsRepository';

export default class DungeonsAndDragonsRepository {
    private readonly model;
    private readonly logger;
    private entity = 'none';

    constructor({ database, logger }: DungeonsAndDragonsRepositoryContract) {
        this.model = database.modelInstance;
        this.logger = logger;
    }

    public setEntity(entity: DnDEntities): void {
        this.entity = entity;
    }

    private formatAndSerializeData(data: unknown): unknown {
        const format = JSON.parse(JSON.stringify(data));
        const { _id, ...withoutMongoId } = format;
        return withoutMongoId;
    }

    public async find(query: any = {}): Promise<unknown[]> {
        const callName = `[${this.constructor.name}] - ${this.find.name}`;
        this.logger('info', callName);
        const model = this.model('dungeons&dragons5e', this.entity as DnDEntities);
        const request = await model.findAll(query);

        return request.map((entity: unknown) => this.formatAndSerializeData(entity));
    }

    public async findOne(query: any = {}): Promise<unknown> {
        const callName = `[${this.constructor.name}] - ${this.findOne.name}`;
        this.logger('info', callName);
        const model = this.model('dungeons&dragons5e', this.entity as DnDEntities);
        const request = await model.findOne(query);

        if (!request) HttpRequestErrors.throwError('content-inexistent');

        return this.formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<unknown> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        const model = this.model('dungeons&dragons5e', this.entity as DnDEntities);
        const request = await model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('content-inexistent');

        return this.formatAndSerializeData(request);
    }
}
