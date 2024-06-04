import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { CampaignsRoutesBuilderContract } from 'src/types/modules/interface/campaigns/CampaignsRoutesBuilder';
import bindMiddleware from 'src/domains/common/helpers/bindMiddleware';

const router = Router();

export default class CampaignsRoutesBuilder {
    private readonly _campaignsRoutes;
    private readonly _verifyUserMiddleware;

    constructor({
        campaignsRoutes,
        verifyUserMiddleware,
    }: CampaignsRoutesBuilderContract) {
        this._campaignsRoutes = campaignsRoutes;
        this._verifyUserMiddleware = verifyUserMiddleware;
    }

    private _campaign(): { campaignRoutes: Router; campaignSwagger: routeInstance[] } {
        const campaignRoutesToBuild = bindMiddleware(
            this._verifyUserMiddleware.userStatus,
            this._campaignsRoutes.routes(),
            { addMethod: 'push' }
        )

        const campaignRoutes = buildRouter(campaignRoutesToBuild, router);
        const campaignSwagger = this._campaignsRoutes.routes();

        return { campaignRoutes, campaignSwagger };
    }

    public get(): {
        campaignsSwagger: routeInstance[];
        campaignsRoutes: { campaign: Router };
    } {
        const campaignsSwagger = [...this._campaign().campaignSwagger];
        const campaignsRoutes = {
            campaign: this._campaign().campaignRoutes,
        };

        return { campaignsSwagger, campaignsRoutes };
    }
}
