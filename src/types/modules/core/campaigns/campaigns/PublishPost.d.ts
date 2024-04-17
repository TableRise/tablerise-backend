import PublishPostService from 'src/core/campaigns/services/campaigns/PublishPostService';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface PublishPostOperationContract {
    publishPostService: PublishPostService;
    schemaValidator: SchemaValidator;
    campaignsSchema: SchemasCampaignType;
    logger: Logger;
}

export interface PublishPostServiceContract {
    campaignsRepository: CampaignsRepository;
    usersRepository: UsersRepository;
    logger: Logger;
}
