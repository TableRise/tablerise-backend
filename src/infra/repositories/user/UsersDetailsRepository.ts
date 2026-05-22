import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class UsersDetailsRepository {
    private readonly model;
    private readonly updateTimestampRepository;
    private readonly serializer;
    private readonly logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['usersDetailsRepositoryContract']) {
        this.updateTimestampRepository = updateTimestampRepository;
        this.model = database.modelInstance('user', 'UserDetails');
        this.serializer = serializer;
        this.logger = logger;
    }

    private formatAndSerializeData(data: UserDetail): UserDetail {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postUserDetails(format);
    }

    public async create(payload: UserDetail): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.create.name}`;
        this.logger('info', callName);

        payload.userDetailId = newUUID();

        const request = await this.model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserDetail[]> {
        const callName = `[${this.constructor.name}] - ${this.find.name}`;
        this.logger('info', callName);
        const request = await this.model.findAll(query);

        return request.map((entity: UserDetail) => this.formatAndSerializeData(entity));
    }

    public async findOne(query: any = {}): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.findOne.name}`;
        this.logger('info', callName);
        const request = await this.model.findOne(query);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        return this.formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        await this.updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }

    public async delete(query: any): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.delete.name}`;
        this.logger('info', callName);
        await this.model.delete(query);
    }
}
