import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UpdateObj } from 'src/types/Repository';
import { UsersDetailsRepositoryContract } from 'src/types/contracts/users/repositories/usersDetailsRepository';

export default class UsersDetailsRepository extends UsersDetailsRepositoryContract {
    constructor({ database, httpRequestErrors, serializer, logger }: UsersDetailsRepositoryContract) {
        super();
        this.model = database.modelInstance('user', 'UserDetails');
        this.httpRequestErrors = httpRequestErrors;
        this.serializer = serializer;
        this.logger = logger;
    }

    private _formatAndSerializeData(data: UserDetailInstance): UserDetailInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postUserDetails(format);
    }

    public async create(payload: UserDetailInstance): Promise<UserDetailInstance> {
        this.logger('info', `[Create - UsersDetailsRepository]`);
        const request = await this.model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<UserDetailInstance[]> {
        this.logger('info', `[Find - UsersDetailsRepository]`);
        const request = await this.model.findAll({ query });
        return request.map((entity: UserDetailInstance) => this._formatAndSerializeData(entity)) ;
    }

    public async findOne(id: string): Promise<UserDetailInstance> {
        this.logger('info', `[FindOne - UsersDetailsRepository - Params: ${id}]`);

        const request = await this.model.findOne({ userId: id });

        if (!request) {
            this.logger('error', 'User was not found on database - UsersDetailsRepository');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        return this._formatAndSerializeData(request);
    }

    public async update({ id, payload }: UpdateObj): Promise<UserDetailInstance> {
        this.logger('info', `[Update - UsersDetailsRepository - Params: ${id}]`);

        const request = await this.model.update({ userId: id }, payload);

        if (!request) {
            this.logger('error', 'User was not found on database - UsersDetailsRepository');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        return this._formatAndSerializeData(request);
    }

    public async delete(id: string): Promise<void> {
        this.logger('warn', `[Delete - UsersDetailsRepository - Params: ${id}]`);
        await this.model.delete({ userId: id });
    }
}
