import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class UsersRepository {
    private readonly model;
    private readonly updateTimestampRepository;
    private readonly serializer;
    private readonly logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['usersRepositoryContract']) {
        this.updateTimestampRepository = updateTimestampRepository;
        this.model = database.modelInstance('user', 'Users');
        this.serializer = serializer;
        this.logger = logger;
    }

    private formatAndSerializeData(data: User): User {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postUser(format);
    }

    public async create(payload: User): Promise<User> {
        this.logger('warn', `Create - UsersRepository`);

        payload.userId = newUUID();

        const request = await this.model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<User[]> {
        this.logger('warn', `Find - UsersRepository`);
        const request = await this.model.findAll(query);

        return request.map((entity: User) => this.formatAndSerializeData(entity));
    }

    public async findOne(query: any = {}): Promise<User> {
        this.logger('warn', 'FindOne - UsersRepository');
        const request = await this.model.findOne(query);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        return this.formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<User> {
        this.logger('warn', 'Update - UsersRepository');

        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        await this.updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }

    public async delete(query: any): Promise<void> {
        this.logger('warn', 'Delete - UsersRepository');
        await this.model.delete(query);
    }
}
