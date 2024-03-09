import { Router } from 'express';
import CampaignsRoutesBuilder from 'src/interface/campaigns/CampaignsRoutesBuilder';

describe('Interface :: Campaigns :: CampaignsRoutesBuilder', () => {
    let campaignsRoutesBuilder: CampaignsRoutesBuilder,
    campaignsRoutes: any,
    verifyIdMiddleware: any;

    context('#get', () => {
        verifyIdMiddleware = () => ({});

        campaignsRoutes = {
            routes: () => [{
                method: 'get',
                path: '/base/api',
                options: {
                    middlewares: [verifyIdMiddleware],
                    authentication: false,
                },
            }]
        };

        beforeEach(() => {
            campaignsRoutes = { routes: () => [] };
            campaignsRoutesBuilder = new CampaignsRoutesBuilder({ campaignsRoutes });
        });

        it('should return correct properties', () => {
            const routes = campaignsRoutesBuilder.get();

            expect(routes.campaignsRoutes).to.have.property('campaign');
            expect(typeof routes.campaignsRoutes.campaign).to.be.equal(typeof Router);
        });
    });
});
