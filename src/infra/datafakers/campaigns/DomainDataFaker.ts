import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CampaignJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import generateCampaignsFaker from './generators/generateCampaignsFaker';

function generateCampaignsJSON(
    { count, campaignId }: CampaignJSONPayload = { count: 1 }
): CampaignInstance[] {
    return generateCampaignsFaker({ count, campaignId });
}

const [{ title, visibility, description, system, ageRestriction }] =
    generateCampaignsJSON();

const mocks = {
    createCampaignMock: { title, visibility, description, system, ageRestriction },
};

export default {
    generateCampaignsJSON,
    mocks,
};
