import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { UpdateObj } from 'src/types/Repository';
import { UsersRepositoryContract } from 'src/types/contracts/users/repositories/usersRepository';

export default class UsersRepository extends UsersRepositoryContract {
    constructor({ database, httpRequestErrors, serializer, logger }: UsersRepositoryContract) {
        super();
        this.model = database.modelInstance('user', 'Users');
        this.httpRequestErrors = httpRequestErrors;
        this.serializer = serializer;
        this.logger = logger;
    }

    private _formatAndSerializeData(data: UserInstance): UserInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postUser(format);
    }

    public async create(payload: UserInstance): Promise<UserInstance> {
        this.logger('info', `[Create - UsersRepository]`);
        const request = await this.model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserInstance[]> {
        this.logger('info', `[Find - UsersRepository]`);
        const request = await this.model.findAll({ query });
        return request.map((entity: UserInstance) => this._formatAndSerializeData(entity)) ;
    }

    public async findOne(id: string): Promise<UserInstance> {
        this.logger('info', `[FindOne - UsersRepository - Params: ${id}]`);

        const request = await this.model.findOne({ userId: id });

        if (!request) {
            this.logger('error', 'User was not found on database - UsersRepository');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        return this._formatAndSerializeData(request);
    }

    public async update({ id, payload }: UpdateObj): Promise<UserInstance> {
        this.logger('info', `[Update - UsersRepository - Params: ${id}]`);

        const request = await this.model.update({ userId: id }, payload);

        if (!request) {
            this.logger('error', 'User was not found on database - UsersRepository');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        return this._formatAndSerializeData(request);
    }

    public async delete(id: string): Promise<void> {
        this.logger('warn', `[Delete - UsersRepository - Params: ${id}]`);
        await this.model.delete({ userId: id });
    }
}
