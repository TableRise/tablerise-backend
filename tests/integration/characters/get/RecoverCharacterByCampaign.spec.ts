import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import requester from 'tests/support/requester';
import { InjectNewCampaign, InjectNewCharacter, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';

describe.only('When characters are recovered by campaign', () => {
    let user: UserInstance[], userDetails: UserDetailInstance[], campaign: CampaignInstance, character: CharacterInstance[];

    context('And player is dungeons_master', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        
        before(async () => {
            user = DomainDataFaker.users.generateUsersJSON({ count: 2 });
            userDetails = DomainDataFaker.users.generateUserDetailsJSON({ count: 2 });
            campaign = DomainDataFaker.campaign.generateCampaignsJSON()[0];
            character = DomainDataFaker.character.generateCharactersJSON({ count: 2 });

            campaign.campaignPlayers[0].userId = userLoggedId;
            campaign.campaignPlayers[0].characterIds = [character[0].characterId as string];
            campaign.campaignPlayers[0].role = 'dungeon_master';

            campaign.campaignPlayers[1] = {
                userId: user[0].userId,
                characterIds: [character[0].characterId as string],
                role: 'player',
                status: 'active'
            };

            campaign.campaignPlayers[2] = {
                userId: user[1].userId,
                characterIds: [character[1].characterId as string],
                role: 'player',
                status: 'active'
            };

            user[0].inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            user[1].inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user[0]);
            await InjectNewUserDetails(userDetails[0], user[0].userId);
            await InjectNewCampaign(campaign);
            await InjectNewCharacter(character[0]);

            await InjectNewUser(user[1]);
            await InjectNewUserDetails(userDetails[1], user[1].userId);
            await InjectNewCampaign(campaign);
            await InjectNewCharacter(character[1]);
        });

        after(() => {
            sinon.restore();
        });

        it('should recover all characters', async () => {
            const { body } = await requester()
                .get(`/characters/by-campaign/${campaign.campaignId}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('array').with.lengthOf(3);

            body.forEach((result: CharacterInstance) => {
                expect(result).to.have.property('characterId');
                expect(result).to.have.property('data');
                expect(result).to.have.property('author');
                expect(result).to.have.property('picture');
                expect(result).to.have.property('npc');
            });
        });
    });

    context('And player is player', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        
        before(async () => {
            user = DomainDataFaker.users.generateUsersJSON({ count: 2 });
            userDetails = DomainDataFaker.users.generateUserDetailsJSON({ count: 2 });
            campaign = DomainDataFaker.campaign.generateCampaignsJSON()[0];
            character = DomainDataFaker.character.generateCharactersJSON({ count: 2 });

            campaign.campaignPlayers[0].userId = userLoggedId;
            campaign.campaignPlayers[0].characterIds = [character[0].characterId as string];
            campaign.campaignPlayers[0].role = 'player';

            campaign.campaignPlayers[1] = {
                userId: user[0].userId,
                characterIds: [character[0].characterId as string],
                role: 'player',
                status: 'active'
            };

            campaign.campaignPlayers[2] = {
                userId: user[1].userId,
                characterIds: [character[1].characterId as string],
                role: 'player',
                status: 'active'
            };

            user[0].inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            user[1].inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user[0]);
            await InjectNewUserDetails(userDetails[0], user[0].userId);
            await InjectNewCampaign(campaign);
            await InjectNewCharacter(character[0]);

            await InjectNewUser(user[1]);
            await InjectNewUserDetails(userDetails[1], user[1].userId);
            await InjectNewCampaign(campaign);
            await InjectNewCharacter(character[1]);
        });

        after(() => {
            sinon.restore();
        });

        it('should recover all characters', async () => {
            const { body } = await requester()
                .get(`/characters/by-campaign/${campaign.campaignId}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('array').with.lengthOf(3);

            body.forEach((result: CharacterInstance) => {
                expect(result).to.have.property('characterId');
                expect(result).to.not.have.property('data');
                expect(result).to.have.property('author');
                expect(result).to.have.property('picture');
                expect(result).to.not.have.property('npc');
            });
        });
    });
});
