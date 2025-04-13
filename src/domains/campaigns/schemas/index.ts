import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignsUpdateMatchDatesZod from './campaignsUpdateMatchDatesValidationSchema';
import campaignPost from './campaignsPostValidationSchema';
import campaignInvitationEmailZod from './campaignsInvitationEmailValidation';
import campaignsAddCampaignPlayersZod from './campaignsAddCampaignPlayersValidationSchema';
import campaignsRemoveCampaignPlayersZod from './campaignsRemoveCampaignPlayersValidationSchema';
import campaignBanPlayerZod from './campaignsBanPlayerValidation';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignsUpdateMatchDatesZod,
    campaignPost,
    campaignInvitationEmailZod,
    campaignsAddCampaignPlayersZod,
    campaignsRemoveCampaignPlayersZod,
    campaignBanPlayerZod,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
