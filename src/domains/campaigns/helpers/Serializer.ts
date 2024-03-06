import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';

export default class Serializer {
    public postCampaign({
        campaignId = null,
        title = null,
        cover = {
            id: null,
            link: null,
            uploadDate: null,
        },
        description = null,
        campaignPlayers = [
            {
                userId: null,
                characterIds: [],
                role: null,
            },
        ],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        match_data = {
            match_id: null,
            avatars: [
                {
                    avatarId: null,
                    userId: null,
                    picture: {
                        id: null,
                        link: null,
                        uploadDate: null,
                    },
                    position: {
                        x: null,
                        y: null,
                    },
                    size: {
                        width: null,
                        height: null,
                    },
                    status: null,
                },
            ],
            music: [
                {
                    title: null,
                    youtubeLink: null,
                },
            ],
            mapImages: [
                {
                    id: null,
                    link: null,
                    uploadDate: null,
                },
            ],
            logs: [
                {
                    loggedAt: null,
                    content: null,
                },
            ],
        },
        infos = {
            campaign_age: null,
            matchDates: [],
            announcements: [
                {
                    title: '',
                    author: null,
                    content: null,
                },
            ],
            visibility: null,
        },
        lores = {
            playerCharacters: [
                {
                    characterId: null,
                    lore: null,
                    createdAt: null,
                    updatedAt: null,
                },
            ],
            dungeonMasterCharacters: [
                {
                    characterId: null,
                    lore: null,
                    createdAt: null,
                    updatedAt: null,
                },
            ],
            environments: [
                {
                    title: null,
                    lore: null,
                    environmentImage: {
                        id: null,
                        link: null,
                        uploadDate: null,
                    },
                    createdAt: null,
                    updatedAt: null,
                },
            ],
            mainHistory: [
                {
                    title: null,
                    lore: null,
                    image: { id: null, link: null, uploadDate: null },
                    createdAt: null,
                    updatedAt: null,
                },
            ],
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        created_at = null,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        updated_at = null,
    }: any): CampaignInstance {
        return {
            campaignId,
            title,
            cover,
            description,
            campaignPlayers,
            match_data,
            infos,
            lores,
            created_at,
            updated_at,
        };
    }
}
