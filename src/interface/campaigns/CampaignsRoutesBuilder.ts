import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { CampaignsRoutesBuilderContract } from 'src/types/modules/interface/campaigns/CampaignsRoutesBuilder';
import bindMiddleware from 'src/domains/common/helpers/bindMiddleware';

const router = Router();

export default class CampaignsRoutesBuilder {
    private readonly campaignsRoutes;
    private readonly verifyUserMiddleware;

    constructor({ campaignsRoutes, verifyUserMiddleware }: CampaignsRoutesBuilderContract) {
        this.campaignsRoutes = campaignsRoutes;
        this.verifyUserMiddleware = verifyUserMiddleware;
    }

    private campaign(): { campaignRoutes: Router; campaignSwagger: routeInstance[] } {
        const campaignRoutesToBuild = bindMiddleware(
            this.verifyUserMiddleware.userStatus,
            this.campaignsRoutes.routes(),
            { addMethod: 'push' }
        );

        const campaignRoutes = buildRouter(campaignRoutesToBuild, router);
        const campaignSwagger = this.campaignsRoutes.routes();

        return { campaignRoutes, campaignSwagger };
    }

    public get(): {
        campaignsSwagger: routeInstance[];
        campaignsRoutes: { campaign: Router };
    } {
        const campaignsSwagger = [...this.campaign().campaignSwagger];
        const campaignsRoutes = {
            campaign: this.campaign().campaignRoutes,
        };

        return { campaignsSwagger, campaignsRoutes };
    }
}
