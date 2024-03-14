import { Router } from 'express';
import CampaignsRoutesBuilder from 'src/interface/campaigns/CampaignsRoutesBuilder';

describe('Interface :: Campaigns :: CampaignsRoutesBuilder', () => {
    let campaignsRoutesBuilder: CampaignsRoutesBuilder,
        campaignsRoutes: any,
        authenticate: any;

    context('When campaigns routes are processed', () => {
        authenticate = () => ({});

        campaignsRoutes = {
            routes: () => [
                {
                    method: 'get',
                    path: '/base/api',
                    options: {
                        middlewares: [authenticate],
                        authentication: false,
                    },
                },
            ],
        };

        beforeEach(() => {
            campaignsRoutesBuilder = new CampaignsRoutesBuilder({
                campaignsRoutes,
            });
        });

        it('should return correct properties', () => {
            const routes = campaignsRoutesBuilder.get();

            expect(routes.campaignsRoutes).to.have.property('campaign');
            expect(typeof routes.campaignsRoutes.campaign).to.be.equal(typeof Router);
        });
    });
});
