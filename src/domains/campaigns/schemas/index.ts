import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignsUpdateMatchDatesZod from './campaignsUpdateMatchDatesValidationSchema';
import campaignPost from './campaignsPostValidationSchema';
import campaignInvitationEmailZod from './campaignsInvitationEmailValidation';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignsUpdateMatchDatesZod,
    campaignPost,
    campaignInvitationEmailZod,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
