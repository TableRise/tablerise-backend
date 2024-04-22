import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignPost from './campaignsPostValidationSchema';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignPost,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
