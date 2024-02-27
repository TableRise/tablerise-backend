import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CampaignJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import generateCampaignsFaker from './generators/generateCampaignsFaker';

function generateCampaignsJSON(
    { count, campaignId }: CampaignJSONPayload = { count: 1 }
): CampaignInstance[] {
    return generateCampaignsFaker({ count, campaignId });
}

const [{ title }] = generateCampaignsJSON();

const mocks = {
    createCampaignMock: { title },
};

export default {
    generateCampaignsJSON,
    mocks,
};
