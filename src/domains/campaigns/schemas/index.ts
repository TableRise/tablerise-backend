import campaignZod from './campaignsValidationSchema';
import campaignUpdateZod from './campaignsUpdateValidationSchema';
import campaignsUpdateMatchDatesZod from './campaignsUpdateMatchDatesValidationSchema';
import campaignPost from './campaignsPostValidationSchema';

const schemas = {
    campaignZod,
    campaignUpdateZod,
    campaignsUpdateMatchDatesZod,
    campaignPost,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
