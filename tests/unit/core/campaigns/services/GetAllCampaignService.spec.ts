import sinon from 'sinon';
import GetAllCampaignsService from 'src/core/campaigns/services/GetAllCampaignsService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';

describe('Core :: Campaigns :: Services :: GetAllCampaignsService', () => {
    let getAllCampaignsService: GetAllCampaignsService, campaignsRepository: any, campaigns: any;

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
                campaigns = campaigns.map((campaign: Campaign, index: number) => {
                    if (HIDDEN !== index) {
                        campaign.infos.visibility = 'visible';
                    } else {
                        campaign.title = 'test';
                        campaign.cover = DomainDataFaker.generateImagesObjectJSON()[0];
                        campaign.description = 'test desciprtion';
                        campaign.campaignPlayers = [];
                        campaign.ageRestriction = String(Number.MAX_SAFE_INTEGER);
                        campaign.infos = {
                            campaignAge: '1',
                            nextMatchDate: 'no-date',
                            announcements: [],
                            playerAmountLimit: 1,
                            visibility: 'hidden',
                        };
                        campaign.updatedAt = new Date(2023, 3, 12).toISOString();
                    }
                    return campaign;
                });

                campaignsRepository = {
                    find: sinon.spy((query: any) =>
                        campaigns.filter((c: Campaign) => c.infos.visibility === query['infos.visibility'])
                    ),
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
                expect(Object.keys(campaignsTest[0]).length).to.be.equal(9);
                expect(campaignsTest[0].title).not.to.be.equal(campaigns[HIDDEN].title);
                expect(campaignsTest[0].description).not.to.be.equal(campaigns[HIDDEN].description);
                expect(campaignsTest[0].playersAmount).not.to.be.equal(campaigns[HIDDEN].campaignPlayers.length);
                expect(campaignsTest[0].ageRestriction).not.to.be.equal(campaigns[HIDDEN].ageRestriction);
                expect(JSON.stringify(campaignsTest[0].updatedAt)).not.to.be.equal(
                    JSON.stringify(campaigns[HIDDEN].updatedAt)
                );
            });

            it('should filter by title when provided', async () => {
                const campaignsTest = await getAllCampaignsService.getAll({ title: 'some-title' });

                expect(campaignsRepository.find).to.have.been.called();
                expect(Array.isArray(campaignsTest)).to.be.true();
            });

            it('should filter by code when provided', async () => {
                const campaignsTest = await getAllCampaignsService.getAll({ code: 'ABC123' });

                expect(campaignsRepository.find).to.have.been.called();
                expect(Array.isArray(campaignsTest)).to.be.true();
            });
        });
    });
});
