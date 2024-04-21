import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignsUpdateMatchDatesZod from './campaignsUpdateMatchDatesValidationSchema';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignsUpdateMatchDatesZod,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
