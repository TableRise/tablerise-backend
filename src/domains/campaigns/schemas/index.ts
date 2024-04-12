import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';

const schemas = {
    campaignZod,
    campaignUpdateZod,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
