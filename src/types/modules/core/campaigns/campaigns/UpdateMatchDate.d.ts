import updateMatchDateService from 'src/core/campaigns/services/UpdateMatchDateService';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface updateMatchDateOperationContract {
    updateMatchDateService: updateMatchDateService;
    campaignsSchema: SchemasCampaignType;
    schemaValidator: SchemaValidator;
    logger: Logger;
}

export interface updateMatchDateServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
