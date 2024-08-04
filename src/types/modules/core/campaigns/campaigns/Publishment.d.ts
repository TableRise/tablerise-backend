import PublishmentService from 'src/core/campaigns/services/campaigns/PublishmentService';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface PublishmentOperationContract {
    publishmentService: PublishmentService;
    schemaValidator: SchemaValidator;
    campaignsSchema: SchemasCampaignType;
    logger: Logger;
}

export interface PublishmentServiceContract {
    campaignsRepository: CampaignsRepository;
    usersRepository: UsersRepository;
    logger: Logger;
}
