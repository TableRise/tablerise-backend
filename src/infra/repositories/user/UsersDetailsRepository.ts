import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { isUserWaitingToDelete } from 'src/domains/common/helpers/RepositoryVisibility';
import { ensureGameInfoCounters } from 'src/domains/users/helpers/GameInfoCounters';

export default class UsersDetailsRepository {
    private readonly model;
    private readonly usersModel;
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
        this.usersModel = database.modelInstance('user', 'Users');
        this.serializer = serializer;
        this.logger = logger;
    }

    private formatAndSerializeData(data: UserDetail): UserDetail {
        const format = JSON.parse(JSON.stringify(data));
        ensureGameInfoCounters(format);
        return this.serializer.postUserDetails(format);
    }

    private getRawCollection():
        | {
              find: (query: any) => { toArray: () => Promise<UserDetail[]> };
              findOne: (query: any) => Promise<UserDetail | null>;
              updateOne: (query: any, payload: any) => Promise<unknown>;
          }
        | undefined {
        const model = this.model as any;
        if (!model || !model._model) return undefined;
        return model._model.collection;
    }

    private async persistRawGameInfoFields(query: any, payload: UserDetail): Promise<void> {
        const rawCollection = this.getRawCollection();
        if (!rawCollection?.updateOne) return;

        const gameInfo = (payload as unknown as Record<string, unknown>).gameInfo as
            | Record<string, unknown>
            | undefined;
        if (!gameInfo || typeof gameInfo.campaignsCreatedAmount !== 'number') return;

        await rawCollection.updateOne(query, {
            $set: {
                'gameInfo.campaignsCreatedAmount': gameInfo.campaignsCreatedAmount,
            },
        });
    }

    private async shouldHideUserDetail(data: UserDetail | null | undefined): Promise<boolean> {
        if (!data || !data.userId) return false;

        const user = await this.usersModel.findOne({ userId: data.userId });
        return isUserWaitingToDelete(user);
    }

    public async create(payload: UserDetail): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.create.name}`;
        this.logger('info', callName);

        payload.userDetailId = newUUID();

        const request = await this.model.create(payload);
        await this.persistRawGameInfoFields({ userDetailId: payload.userDetailId }, payload);

        const rawRequest = await this.getRawCollection()?.findOne({ userDetailId: payload.userDetailId });
        return this.formatAndSerializeData((rawRequest ?? request) as UserDetail);
    }

    public async find(query: any = {}): Promise<UserDetail[]> {
        const callName = `[${this.constructor.name}] - ${this.find.name}`;
        this.logger('info', callName);
        const rawCollection = this.getRawCollection();
        const request = rawCollection ? await rawCollection.find(query).toArray() : await this.model.findAll(query);
        const serializedUsers = request.map((entity: UserDetail) => this.formatAndSerializeData(entity));
        const availability = await Promise.all(
            serializedUsers.map(async (userDetail) => !(await this.shouldHideUserDetail(userDetail)))
        );

        return serializedUsers.filter((_userDetail, index) => availability[index]);
    }

    public async findOne(query: any = {}): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.findOne.name}`;
        this.logger('info', callName);
        const request = (await this.getRawCollection()?.findOne(query)) ?? (await this.model.findOne(query));

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        const userDetail = this.formatAndSerializeData(request);
        if (await this.shouldHideUserDetail(userDetail)) return null as unknown as UserDetail;

        return userDetail;
    }

    public async update({ query, payload }: UpdateObj): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('user-inexistent');

        await this.persistRawGameInfoFields(query, payload as UserDetail);

        await this.updateTimestampRepository.updateTimestamp(query);

        const rawRequest = await this.getRawCollection()?.findOne(query);
        return this.formatAndSerializeData((rawRequest ?? request) as UserDetail);
    }

    public async delete(query: any): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.delete.name}`;
        this.logger('info', callName);
        await this.model.delete(query);
    }
}
