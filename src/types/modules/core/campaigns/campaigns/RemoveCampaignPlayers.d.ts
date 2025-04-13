import RemoveCampaignPlayersService from 'src/core/campaigns/services/campaigns/RemoveCampaignPlayersService';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import { Logger } from 'src/types/shared/logger';

export interface RemoveCampaignPlayersOperationContract {
    removeCampaignPlayersService: RemoveCampaignPlayersService;
    schemaValidator: SchemaValidator;
    campaignsSchema: SchemasCampaignType;
    logger: Logger;
}

export interface RemoveCampaignPlayersServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
