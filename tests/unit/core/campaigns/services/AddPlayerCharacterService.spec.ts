import Sinon from 'sinon';
import AddPlayerCharacterService from 'src/core/campaigns/services/AddPlayerCharacterService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Camapaigns :: Services :: AddPlayerCharacterService', async () => {
    let addPlayerCharacterService: AddPlayerCharacterService,
        campaignsRepository: any,
        addPlayerCharacterPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#addCharacter', () => {
        context('When a player character is added to campaign', () => {
            const userId = newUUID();

            before(async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                campaign.campaignPlayers[0] = {
                    userId,
                    characterIds: [],
                    role: 'player',
                    status: 'active',
                };

                addPlayerCharacterPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId,
                };

                addPlayerCharacterService = new AddPlayerCharacterService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the added character campaign', async () => {
                const characterAdded = await addPlayerCharacterService.addCharacter(
                    addPlayerCharacterPayload
                );

                expect(
                    characterAdded.campaignPlayers[0].characterIds.length <
                        campaign.campaignPlayers[0].characterIds.length
                ).to.be.not.equal(true);
            });
        });

        context('When a player do not exists', () => {
            before(async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                campaign.campaignPlayers = [];

                addPlayerCharacterPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId: '123',
                };

                addPlayerCharacterService = new AddPlayerCharacterService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should return the add campaign', async () => {
                try {
                    await addPlayerCharacterService.addCharacter(
                        addPlayerCharacterPayload
                    );
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('This player is not in the campaign');
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });

    context('#save', () => {
        context('When a player character is saved in campaign', () => {
            const userId = newUUID();

            before(async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                    update: Sinon.spy(() => campaign),
                };

                campaign.campaignPlayers[0] = {
                    userId,
                    characterIds: ['123'],
                    role: 'player',
                    status: 'active',
                };

                addPlayerCharacterPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId: '123',
                };

                addPlayerCharacterService = new AddPlayerCharacterService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should call correct methods', async () => {
                await addPlayerCharacterService.save(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
