import campaignZod, { createCampaignsZodSchema } from './campaignsValidationSchema';

const schemas = {
    campaignZod,
    createCampaignsZodSchema,
};

export type SchemasCampaignType = typeof schemas;

export default schemas;
