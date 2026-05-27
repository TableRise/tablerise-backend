import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateObj } from 'src/types/shared/repository';
import {
    getCharacterAuthorUserId,
    getCharacterCampaignId,
    isClosedCampaign,
    isUserWaitingToDelete,
} from 'src/domains/common/helpers/RepositoryVisibility';

export default class CharactersRepository {
    private readonly model;
    private readonly campaignsModel;
    private readonly usersModel;
    private readonly serializer;
    private readonly updateTimestampRepository;
    private readonly logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['CharactersRepositoryContract']) {
        this.updateTimestampRepository = updateTimestampRepository;
        this.serializer = serializer;
        this.model = database.modelInstance('characterDnd', 'CharactersDnd');
        this.campaignsModel = database.modelInstance('campaign', 'Campaigns');
        this.usersModel = database.modelInstance('user', 'Users');
        this.logger = logger;
    }

    private formatAndSerializeData(data: CharactersDnd): CharactersDnd {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postCharacter(format);
    }

    private async shouldHideCharacter(data: CharactersDnd | null | undefined): Promise<boolean> {
        const campaignId = getCharacterCampaignId(data);
        if (campaignId) {
            const campaign = await this.campaignsModel.findOne({ campaignId });
            if (isClosedCampaign(campaign)) return true;
        }

        const authorUserId = getCharacterAuthorUserId(data);
        if (!authorUserId) return false;

        const user = await this.usersModel.findOne({ userId: authorUserId });
        return isUserWaitingToDelete(user);
    }

    public async create(payload: CharactersDnd): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.create.name}`;
        this.logger('info', callName);
        const request = await this.model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async findOne(query: any = {}): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.findOne.name}`;
        this.logger('info', callName);
        const request = await this.model.findOne(query);

        if (!request) HttpRequestErrors.throwError('character-does-not-exist');

        const character = this.formatAndSerializeData(request);
        if (await this.shouldHideCharacter(character)) return null as unknown as CharactersDnd;

        return character;
    }

    public async find(query: any = {}): Promise<CharactersDnd[]> {
        const callName = `[${this.constructor.name}] - ${this.find.name}`;
        this.logger('info', callName);
        const request = await this.model.findAll(query);
        const serializedCharacters = request.map((data: CharactersDnd) => this.formatAndSerializeData(data));
        const availability = await Promise.all(
            serializedCharacters.map(async (character: CharactersDnd) => !(await this.shouldHideCharacter(character)))
        );

        return serializedCharacters.filter((_character: CharactersDnd, index: number) => availability[index]);
    }

    public async update({ query, payload }: UpdateObj): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);

        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('character-does-not-exist');

        await this.updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }

    public async delete(query: any): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.delete.name}`;
        this.logger('info', callName);
        await this.model.delete(query);
    }
}
