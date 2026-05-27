import DatabaseManagement from '@tablerise/database-management';
import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewCharacter, InjectNewUser } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When deleting a character', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const authenticatedUserDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');
    const campaignModel = new DatabaseManagement().modelInstance('campaign', 'Campaigns');

    const buildCharacter = (authorUserId: string): CharactersDnd =>
        ({
            characterId: newUUID(),
            campaignId: null,
            matchId: null,
            author: {
                userId: authorUserId,
                nickname: 'Percy',
                fullname: 'Adson Gomes Oliveira',
            },
            data: {
                profile: {
                    name: 'Teste',
                    class: newUUID(),
                    race: newUUID(),
                    level: 1,
                    xp: 0,
                    characteristics: {
                        alignment: 'N/A',
                        backstory: 'N/A',
                        background: 'N/A',
                        personalityTraits: 'N/A',
                        ideals: 'N/A',
                        bonds: 'N/A',
                        flaws: 'N/A',
                        appearance: {
                            eyes: 'azul',
                            age: '12',
                            weight: 'N/A',
                            height: '132',
                            skin: 'N/A',
                            hair: 'N/A',
                            picture: null,
                            description: 'N/A',
                        },
                        alliesAndOrgs: 'N/A',
                        other: {
                            characteristicsAndAbilities: 'N/A',
                        },
                        treasure: 'N/A',
                    },
                },
                stats: {
                    abilityScores: [
                        { ability: 'str', value: 16, modifier: 3, proficiency: false },
                        { ability: 'dex', value: 16, modifier: 3, proficiency: true },
                        { ability: 'con', value: 12, modifier: 1, proficiency: false },
                        { ability: 'int', value: 8, modifier: -1, proficiency: true },
                        { ability: 'wis', value: 15, modifier: 2, proficiency: false },
                        { ability: 'cha', value: 10, modifier: 0, proficiency: false },
                    ],
                    skills: [
                        { name: 'history', value: 1, checked: true },
                        { name: 'medicine', value: 4, checked: true },
                    ],
                    proficiencyBonus: 2,
                    inspiration: 0,
                    passiveWisdom: 12,
                    speed: 9.1,
                    initiative: 3,
                    armorClass: 13,
                    hitPoints: {
                        points: 9,
                        currentPoints: 9,
                        tempPoints: 0,
                        dicePoints: '1d8',
                    },
                    deathSaves: {
                        success: 0,
                        failures: 0,
                    },
                    spellCasting: {
                        class: 'Bardo',
                        ability: 'carisma',
                        saveDc: 10,
                        attackBonus: 2,
                    },
                },
                inventory: 'N/A',
                equipments: [
                    {
                        equipmentId: newUUID(),
                        name: 'Couro Batido',
                        type: 'Armadura Leve',
                        price: [45, 'PO'],
                        armorClass: [12, '+ DES'],
                        strength: null,
                        stealth: null,
                        weight: '6,5 kg',
                        damage: null,
                        properties: null,
                    },
                ],
                money: {
                    cp: 0,
                    sp: 118,
                    ep: 0,
                    gp: 85,
                    pp: 0,
                },
                spells: {
                    1: { spellIds: [], slotsTotal: 2, slotsExpended: 0 },
                    2: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    3: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    4: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    5: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    6: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    7: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    8: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    9: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    cantrips: [],
                },
                extraAbilities: {
                    1: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    2: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    3: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    4: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    5: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    6: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    7: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    8: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    9: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    cantrips: [],
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as any,
            npc: false,
            picture: {
                request: { success: true, status: 200 },
                id: '',
                title: '',
                link: 'https://i.ibb.co/example.png',
                uploadDate: new Date().toISOString(),
                deleteUrl: '',
            },
            logs: [
                {
                    message: 'Personagem criado com sucesso',
                    loggedAt: '2026-05-24',
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }) as CharactersDnd;

    beforeEach(async () => {
        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: authenticatedUserDetailsId });
        authenticatedUserDetails.gameInfo.characters = [];
        await userDetailsModel.update({ userDetailId: authenticatedUserDetailsId }, authenticatedUserDetails);
    });

    it('should hard delete the character and clean owner and campaign references', async () => {
        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        const character = buildCharacter(authenticatedUserId);

        campaign.infos.highlightedJournal = {
            title: 'Current highlight',
            author: {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
            content: 'A highlighted post for validation',
            timestamp: new Date().toISOString(),
            category: 'announcements',
        };
        character.campaignId = campaign.campaignId as string;

        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [character.characterId, 'other-character'],
                role: 'player',
                status: 'active',
            },
        ] as Player[];

        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: authenticatedUserDetailsId });
        authenticatedUserDetails.gameInfo.characters = [character.characterId];
        await userDetailsModel.update({ userDetailId: authenticatedUserDetailsId }, authenticatedUserDetails);

        await InjectNewCampaign(campaign);
        await InjectNewCharacter(character);

        await requester().delete(`/characters/${character.characterId}/delete`).expect(HttpStatusCode.NO_CONTENT);

        await requester().get(`/characters/${character.characterId}`).expect(HttpStatusCode.NOT_FOUND);

        const { body: authenticatedUserUpdated } = await requester()
            .get(`/users/${authenticatedUserId}`)
            .expect(HttpStatusCode.OK);
        expect(authenticatedUserUpdated.details.gameInfo.characters).to.not.include(character.characterId);

        const campaignInDb = (await campaignModel.findOne({ campaignId: campaign.campaignId })) as Campaign;
        expect(campaignInDb.campaignPlayers[0].characterIds).to.deep.equal(['other-character']);
    });

    it('should reject deletion when the authenticated user does not own the character', async () => {
        const anotherUser = UsersDomainDataFaker.generateUsersJSON()[0];
        const character = buildCharacter(anotherUser.userId);

        await InjectNewUser(anotherUser);
        character.author.nickname = anotherUser.nickname;
        character.author.fullname = 'Other User';
        await InjectNewCharacter(character);

        const { body } = await requester()
            .delete(`/characters/${character.characterId}/delete`)
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.equal('The operation is forbidden for this role');
    });
});
