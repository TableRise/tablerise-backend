import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';

export default class Serializer {
    public postCampaign({
        campaignId = null,
        title = null,
        cover = null,
        description = null,
        campaignPlayers = null,
        matchData = null,
        infos = {
            campaignAge: '1',
            matchDates: [],
            announcements: [],
            visibility: 'visible',
        },
        lores = null,
        createdAt = null,
        updatedAt = null,
    }: any): CampaignInstance {
        return {
            campaignId,
            title,
            cover,
            description,
            campaignPlayers,
            matchData,
            infos,
            lores,
            createdAt,
            updatedAt,
        };
    }
}
