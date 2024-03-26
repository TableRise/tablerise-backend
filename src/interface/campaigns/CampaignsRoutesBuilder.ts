import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { CampaignsRoutesBuilderContract } from 'src/types/modules/interface/campaigns/CampaignsRoutesBuilder';

const router = Router();

export default class CampaignsRoutesBuilder {
    private readonly _campaignsRoutes;

    constructor({ campaignsRoutes }: CampaignsRoutesBuilderContract) {
        this._campaignsRoutes = campaignsRoutes;
    }

    private _campaign(): { campaignRoutes: Router; campaignSwagger: routeInstance[] } {
        const campaignRoutes = buildRouter(this._campaignsRoutes.routes(), router);
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
