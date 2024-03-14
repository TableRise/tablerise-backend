import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CampaignJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import dataGenerator from '../dataGenerator';

function createCampaignFaker({
    campaignId = newUUID(),
}: CampaignInstance): CampaignInstance {
    const userOneId = newUUID();
    const userTwoId = newUUID();
    const userThreeId = newUUID();

    const avatarOneCharIds = [newUUID(), newUUID()];
    const avatarTwoCharIds = [newUUID(), newUUID()];
    const avatarThreeCharIds = [newUUID(), newUUID()];

    return {
        campaignId,
        title: dataGenerator.title(),
        cover: {
            id: newUUID(),
            link: 'https://imgur.com',
            uploadDate: new Date().toISOString(),
        },
        description: dataGenerator.description(3),
        campaignPlayers: [
            {
                userId: userOneId,
                characterIds: avatarOneCharIds,
                role: 'player',
            },
            {
                userId: userTwoId,
                characterIds: avatarTwoCharIds,
                role: 'admin_player',
            },
            {
                userId: userThreeId,
                characterIds: avatarThreeCharIds,
                role: 'dungeon_master',
            },
        ],
        matchData: {
            matchId: newUUID(),
            avatars: [
                {
                    avatarId: newUUID(),
                    userId: userOneId,
                    picture: {
                        id: newUUID(),
                        link: 'https://imgur.com',
                        uploadDate: new Date().toISOString(),
                    },
                    position: { x: 142, y: 741 },
                    size: { width: 200, height: 200 },
                    status: 'alive',
                },
                {
                    avatarId: newUUID(),
                    characterId: avatarTwoCharIds[0],
                    userId: userTwoId,
                    picture: {
                        id: newUUID(),
                        link: 'https://imgur.com',
                        uploadDate: new Date().toISOString(),
                    },
                    position: { x: 142, y: 741 },
                    size: { width: 200, height: 200 },
                    status: 'alive',
                },
                {
                    avatarId: newUUID(),
                    characterId: avatarThreeCharIds[0],
                    userId: userThreeId,
                    picture: {
                        id: newUUID(),
                        link: 'https://imgur.com',
                        uploadDate: new Date().toISOString(),
                    },
                    position: { x: 142, y: 741 },
                    size: { width: 200, height: 200 },
                    status: 'alive',
                },
            ],
            musics: [
                {
                    title: dataGenerator.title(),
                    youtubeLink: 'https://youtu.be/link',
                },
            ],
            mapImages: [
                {
                    id: newUUID(),
                    link: 'https://imgur.com',
                    uploadDate: new Date().toISOString(),
                },
            ],
            logs: [
                {
                    content: 'Some log printed',
                    loggedAt: new Date().toISOString(),
                },
            ],
        },
        mapImages: [
            {
                id: newUUID(),
                link: 'https://imgur.com',
                uploadDate: '2024-03-09Z22:43:14',
            },
        ],
        logs: [
            {
                loggedAt: new Date().toISOString(),
                content: 'Dice was roled with 14+2 by TheDicer_01',
            },
            {
                loggedAt: new Date().toISOString(),
                content: 'FatuiKiller is dead',
            },
        ],
        infos: {
            campaignAge: '11',
            matchDates: [''],
            announcements: [
                {
                    title: 'Novo jogador na próxima partida',
                    author: 'RedHorse44',
                    content: 'Some content',
                },
            ],
            visibility: 'visible',
        },
        system: 'dnd5e',
        ageRestriction: 16,
        lores: {
            playerCharacters: [
                {
                    characterId: 'fa7911c9-afd1-423b-b578-d36e8d950e10',
                    lore: 'A random lore was told through winds',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            dungeonMasterCharacters: [
                {
                    characterId: 'fa91df8c-56b3-4128-92b8-3ae8582ded50',
                    lore: 'Some day the sun will rise again',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            environments: [
                {
                    title: 'Destroyed Land',
                    lore: 'A land destroyed by a monster',
                    environmentImage: {
                        id: '123',
                        link: 'https://imgur.com',
                        uploadDate: new Date().toISOString(),
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            mainHistory: [
                {
                    title: 'Promise Land',
                    lore: 'A magic land',
                    image: {
                        id: '123',
                        link: 'https://imgur.com',
                        uploadDate: new Date().toISOString(),
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    } as CampaignInstance;
}

export default function generateCampaignsFaker({
    count,
    campaignId,
}: CampaignJSONPayload): CampaignInstance[] {
    const campaigns: CampaignInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        campaigns.push(createCampaignFaker({ campaignId } as CampaignInstance));
    }

    return campaigns;
}
