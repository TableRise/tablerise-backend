import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import DeleteCharacterService from 'src/core/characters/services/DeleteCharacterService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Characters :: Services :: DeleteCharacterService', () => {
    let deleteCharacterService: DeleteCharacterService;
    let charactersRepository: any;
    let usersDetailsRepository: any;
    let campaignsRepository: any;
    let character: CharactersDnd;
    let campaign: Campaign;
    let userDetails: any;

    const logger = (): void => {};

    beforeEach(() => {
        character = CharacterDomainDataFaker.generateCharactersJSON()[0];
        character.characterId = 'character-1';
        character.author = {
            userId: 'owner-user',
            nickname: 'Owner',
            fullname: 'Owner User',
        };
        character.campaignId = 'campaign-1';

        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignId = 'campaign-1';
        campaign.campaignPlayers = [
            {
                userId: 'owner-user',
                characterIds: ['character-1', 'character-2'],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'other-user',
                characterIds: ['character-1'],
                role: 'player',
                status: 'active',
            },
        ];

        userDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.userId = 'owner-user';
        userDetails.gameInfo.characters = ['character-1', 'character-3'];

        charactersRepository = {
            findOne: sinon.stub().resolves(character),
            delete: sinon.stub().resolves(),
        };

        usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        deleteCharacterService = new DeleteCharacterService({
            charactersRepository,
            usersDetailsRepository,
            campaignsRepository,
            logger,
        } as any);
    });

    it('should remove the character from user details, campaign players, and repository', async () => {
        const savedCampaign = await deleteCharacterService.delete({
            characterId: 'character-1',
            userId: 'owner-user',
        });

        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userId: 'owner-user' },
            payload: sinon.match.hasNested('gameInfo.characters', ['character-3']),
        });
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: 'campaign-1' },
            payload: sinon.match({
                campaignPlayers: [
                    sinon.match.has('characterIds', ['character-2']),
                    sinon.match.has('characterIds', []),
                ],
            }),
        });
        expect(charactersRepository.delete).to.have.been.calledWith({ characterId: 'character-1' });
        expect(savedCampaign?.campaignPlayers[0].characterIds).to.deep.equal(['character-2']);
        expect(savedCampaign?.campaignPlayers[1].characterIds).to.deep.equal([]);
    });

    it('should delete characters without campaign updates when campaignId is null', async () => {
        character.campaignId = null;

        const savedCampaign = await deleteCharacterService.delete({
            characterId: 'character-1',
            userId: 'owner-user',
        });

        expect(campaignsRepository.findOne).to.not.have.been.called();
        expect(campaignsRepository.update).to.not.have.been.called();
        expect(charactersRepository.delete).to.have.been.calledWith({ characterId: 'character-1' });
        expect(savedCampaign).to.equal(null);
    });

    it('should reject deletion when the authenticated user is not the owner', async () => {
        try {
            await deleteCharacterService.delete({
                characterId: 'character-1',
                userId: 'another-user',
            });
            expect.fail('it should not be here');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('The operation is forbidden for this role');
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
        }

        expect(usersDetailsRepository.update).to.not.have.been.called();
        expect(campaignsRepository.update).to.not.have.been.called();
        expect(charactersRepository.delete).to.not.have.been.called();
    });
});
