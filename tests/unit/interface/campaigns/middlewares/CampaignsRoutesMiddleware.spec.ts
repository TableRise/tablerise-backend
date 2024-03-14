import { Request, Response } from 'express';
import sinon from 'sinon';
import CampaignsRoutesMiddleware from 'src/interface/campaigns/middlewares/CampaignsRoutesMiddleware';

describe('Interface :: DungeonsAndDragons :: Middlewares :: CampaignsRoutesMiddleware', () => {
    let campaignsRoutesMiddleware: CampaignsRoutesMiddleware, routesWrapper: any;

    context('When the correct routes are wrapped in the middleware', () => {
        beforeEach(() => {
            routesWrapper = {
                routes: sinon.spy(() => ({
                    campaign: {
                        campaign: (req: Request, res: Response) => {},
                    },
                })),
            };

            campaignsRoutesMiddleware = new CampaignsRoutesMiddleware({
                routesWrapper,
            });
        });

        it('should return correct routes', () => {
            const routes = campaignsRoutesMiddleware.get();

            expect(routesWrapper.routes).to.have.been.called(1);
            expect(routes.stack).to.have.lengthOf(1);
            expect(routes.stack[0].name).to.be.equal('campaign');
        });
    });
});
