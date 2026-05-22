import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';

type MatchStatePatch = Partial<Omit<Campaign['matchData']['state'], 'tokens'>>;

interface RealtimeStateUpdatePayload {
    matchStateFields?: MatchStatePatch;
    tokens?: Campaign['matchData']['state']['tokens'];
    logs?: Campaign['matchData']['logs'];
    confirmedPlayers?: Campaign['matchData']['confirmedPlayers'];
    highlightedJournal?: Campaign['infos']['highlightedJournal'];
}

export default class CampaignsRepository {
    private readonly model;
    private readonly serializer;
    private readonly updateTimestampRepository;
    private readonly logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['campaignsRepositoryContract']) {
        this.model = database.modelInstance('campaign', 'Campaigns');
        this.updateTimestampRepository = updateTimestampRepository;
        this.serializer = serializer;
        this.logger = logger;
    }

    private formatAndSerializeData(data: Campaign): Campaign {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postCampaign(format);
    }

    private async updateAndSerialize(query: any, payload: any): Promise<Campaign> {
        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        await this.updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }

    public async create(payload: Campaign): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.create.name}`;
        this.logger('info', callName);

        payload.campaignId = newUUID();

        const request = await this.model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async findOne(query: any = {}): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.findOne.name}`;
        this.logger('info', callName);
        const request = await this.model.findOne(query);
        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        return this.formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<Campaign[]> {
        const callName = `[${this.constructor.name}] - ${this.find.name}`;
        this.logger('info', callName);
        const request = await this.model.findAll(query);

        return request.map((data) => this.formatAndSerializeData(data));
    }

    public async update({ query, payload }: UpdateObj): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        return this.updateAndSerialize(query, payload);
    }

    public async delete(query: any): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.delete.name}`;
        this.logger('info', callName);
        await this.model.delete(query);
    }

    public async updateRealtimeState(campaignId: string, payload: RealtimeStateUpdatePayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.updateRealtimeState.name}`;
        this.logger('info', callName);

        const updatePayload: Record<string, unknown> = {};

        if (payload.matchStateFields) {
            Object.entries(payload.matchStateFields).forEach(([field, value]) => {
                updatePayload[`matchData.state.${field}`] = value;
            });
        }

        if (payload.tokens !== undefined) updatePayload['matchData.state.tokens'] = payload.tokens;
        if (payload.logs !== undefined) updatePayload['matchData.logs'] = payload.logs;
        if (payload.confirmedPlayers !== undefined)
            updatePayload['matchData.confirmedPlayers'] = payload.confirmedPlayers;
        if (payload.highlightedJournal !== undefined)
            updatePayload['infos.highlightedJournal'] = payload.highlightedJournal;

        if (!Object.keys(updatePayload).length) {
            return this.findOne({ campaignId });
        }

        return this.updateAndSerialize(
            { campaignId },
            {
                $set: updatePayload,
            }
        );
    }

    public async updateMatchStateFields(campaignId: string, patch: MatchStatePatch): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.updateMatchStateFields.name}`;
        this.logger('info', callName);
        return this.updateRealtimeState(campaignId, { matchStateFields: patch });
    }

    public async updateTokens(campaignId: string, tokens: Campaign['matchData']['state']['tokens']): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.updateTokens.name}`;
        this.logger('info', callName);
        return this.updateRealtimeState(campaignId, { tokens });
    }

    public async updateMatchLogs(campaignId: string, logs: Campaign['matchData']['logs']): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.updateMatchLogs.name}`;
        this.logger('info', callName);
        return this.updateRealtimeState(campaignId, { logs });
    }

    public async updateBuys(campaignId: string, buys: Campaign['buys']): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.updateBuys.name}`;
        this.logger('info', callName);
        return this.updateAndSerialize(
            { campaignId },
            {
                $set: {
                    buys,
                },
            }
        );
    }

    public async updateConfirmedPlayers(
        campaignId: string,
        confirmedPlayers: Campaign['matchData']['confirmedPlayers']
    ): Promise<Campaign> {
        this.logger('warn', 'UpdateConfirmedPlayers - CampaignsRepository');
        return this.updateRealtimeState(campaignId, { confirmedPlayers });
    }

    public async updateHighlightedJournal(
        campaignId: string,
        highlightedJournal: Campaign['infos']['highlightedJournal']
    ): Promise<Campaign> {
        this.logger('warn', 'UpdateHighlightedJournal - CampaignsRepository');
        return this.updateRealtimeState(campaignId, { highlightedJournal });
    }
}
