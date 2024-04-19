import sinon from 'sinon';
import GetAllCampaignsService from 'src/core/campaigns/services/GetAllCampaignsService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';

describe('Core :: Campaigns :: Services :: GetAllCampaignsService', () => {
    let getAllCampaignsService: GetAllCampaignsService,
        campaignsRepository: any,
        campaigns: any;

    const logger = (): void => {};
    const HIDDEN = 0;

    context('#get', () => {
        context('When all campaigns are successfully recovered', () => {
            before(() => {
                const id = newUUID();

                campaigns = DomainDataFaker.generateCampaignsJSON({
                    count: 3,
                    campaignId: id,
                });
                campaigns = campaigns.map((campaign: CampaignInstance, index: number) => {
                    if (HIDDEN !== index) {
                        campaign.infos.visibility = 'visible';
                    } else {
                        campaign.title = 'test';
                        campaign.cover = {
                            id: '1',
                            link: 'xcom.pt',
                            uploadDate: '01/01/2001',
                        };
                        campaign.description = 'test desciprtion';
                        campaign.campaignPlayers = [];
                        campaign.ageRestriction = Number.MAX_SAFE_INTEGER;
                        campaign.infos.visibility = 'hidden';
                        campaign.infos = {
                            campaignAge: '1',
                            matchDates: [],
                            announcements: [],
                            visibility: 'hidden',
                        };
                        campaign.updatedAt = new Date(2023, 3, 12).toISOString();
                    }
                    return campaign;
                });

                campaignsRepository = {
                    find: sinon.spy(() => campaigns),
                };

                getAllCampaignsService = new GetAllCampaignsService({
                    campaignsRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const campaignsTest = await getAllCampaignsService.getAll();

                expect(campaignsRepository.find).to.have.been.called();
                expect(campaignsTest.length).to.be.equal(campaigns.length - 1);
                expect(Object.keys(campaignsTest[0]).length).to.be.equal(6);
                expect(campaignsTest[0].title).not.to.be.equal(campaigns[HIDDEN].title);
                expect(campaignsTest[0].cover).not.to.be.equal(campaigns[HIDDEN].cover);
                expect(campaignsTest[0].description).not.to.be.equal(
                    campaigns[HIDDEN].description
                );
                expect(campaignsTest[0].playersAmount).not.to.be.equal(
                    campaigns[HIDDEN].campaignPlayers.length
                );
                expect(campaignsTest[0].ageRestriction).not.to.be.equal(
                    campaigns[HIDDEN].ageRestriction
                );
                expect(JSON.stringify(campaignsTest[0].updatedAt)).not.to.be.equal(
                    JSON.stringify(campaigns[HIDDEN].updatedAt)
                );
            });
        });
    });
});
