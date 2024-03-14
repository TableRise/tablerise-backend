import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CampaignJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import generateCampaignsFaker from './generators/generateCampaignsFaker';

function generateCampaignsJSON(
    { count, campaignId }: CampaignJSONPayload = { count: 1 }
): CampaignInstance[] {
    return generateCampaignsFaker({ count, campaignId });
}

const [
    {
        campaignId,
        title,
        visibility,
        description,
        system,
        ageRestriction,
        campaignPlayers,
        matchData,
        infos,
        lores,
        createdAt,
        updatedAt,
    },
] = generateCampaignsJSON();

const mocks = {
    campaignMock: {
        campaignId,
        title,
        description,
        system,
        ageRestriction,
        campaignPlayers,
        matchData,
        infos,
        lores,
        createdAt,
        updatedAt,
    },
    createCampaignMock: { title, visibility, description, system, ageRestriction },
};

export default {
    generateCampaignsJSON,
    mocks,
};
