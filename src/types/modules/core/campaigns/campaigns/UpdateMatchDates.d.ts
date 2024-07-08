import UpdateMatchDatesService from 'src/core/campaigns/services/campaigns/UpdateMatchDatesService';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchDatesOperationContract {
    updateMatchDatesService: UpdateMatchDatesService;
    campaignsSchema: SchemasCampaignType;
    schemaValidator: SchemaValidator;
    logger: Logger;
}

export interface UpdateMatchDatesServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
