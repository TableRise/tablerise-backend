import CreateCampaignService from 'src/core/campaigns/services/campaigns/CreateCampaignService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import { SchemasCampaignType } from 'src/domains/campaigns/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import { Logger } from '../../../../Logger';
import Serializer from 'src/domains/common/helpers/Serializer';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';

export interface CreateCampaignOperationContract {
    campaignsSchema: SchemasCampaignType;
    schemaValidator: SchemaValidator;
    createCampaignService: CreateCampaignService;
    logger: Logger;
}

export interface CreateCampaignServiceContract {
    campaignsRepository: CampaignsRepository;
    serializer: Serializer;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
