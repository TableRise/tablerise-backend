import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import VerifyMatchMiddleware from 'src/interface/campaigns/middlewares/VerifyMatchMiddleware';

describe('Interface :: Campaigns :: Middlewares :: VerifyMatchMiddleware', () => {
    let verifyMatchMiddleware: any, campaign: any, campaignsRepository: any;

    const logger = (): unknown => ({});
    const request = {} as Request;
    const _response = {} as Response;
    const next = sinon.spy(() => {}) as NextFunction;

    context('When a campaign has a match started', () => {
        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            campaignsRepository = {
                findOne: sinon.spy(() => campaign),
            };

            verifyMatchMiddleware = new VerifyMatchMiddleware({
                campaignsRepository,
                logger,
            });
        });

        it('should call exists method sucessfull', async () => {
            request.params = { id: campaign.campaignId };
            await verifyMatchMiddleware.exists(request, _response, next);

            expect(campaignsRepository.findOne).to.have.been.called();
            expect(next).to.have.been.called();
        });
    });

    context('When a campaign does not have a match and can not be updated', () => {
        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.matchData = undefined;

            campaignsRepository = {
                findOne: sinon.spy(() => campaign),
            };

            verifyMatchMiddleware = {
                exists: sinon.spy(),
            };

            verifyMatchMiddleware = new VerifyMatchMiddleware({
                campaignsRepository,
                logger,
            });
        });

        it('should throw a Bad Request Error', async () => {
            request.params = { id: campaign.campaignId };
            try {
                await verifyMatchMiddleware.exists(request, _response, next);
                expect.fail('if error is throwed skip this line');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal(
                    'Campaign Match does not exist and cannot be updated'
                );
                expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
            }
        });
    });
});
