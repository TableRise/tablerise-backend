import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CampaignJSONPayload, ImageJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import generateCampaignsFaker from './generators/generateCampaignsFaker';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import generateImagesFaker from './generators/generateImagesFaker';

function generateCampaignsJSON({ count, campaignId }: CampaignJSONPayload = { count: 1 }): Campaign[] {
    return generateCampaignsFaker({ count, campaignId });
}

function generateImagesObjectJSON({ count, id }: ImageJSONPayload = { count: 1 }): ImageObject[] {
    return generateImagesFaker({ count, id });
}

const [
    {
        campaignId,
        title,
        description,
        system,
        ageRestriction,
        campaignPlayers,
        matchData,
        infos,
        password,
        lores,
        createdAt,
        updatedAt,
    },
] = generateCampaignsJSON();

const mocks = {
    campaignMock: {
        campaignId,
        title,
        description,
        system,
        ageRestriction,
        campaignPlayers,
        matchData,
        infos,
        password,
        lores,
        createdAt,
        updatedAt,
    },
    createCampaignMock: {
        title,
        description,
        system,
        ageRestriction,
        password,
        playerAmountLimit: '4',
        visibility: infos.visibility,
        cover: { isBinary: true },
    },
    uploadMatchMapImage: { mapImage: { isBinary: true } },
    uploadMatchMusics: {
        title: 'Main Theme',
        youtubeLink: 'https://youtube.com/',
    },
    updateCampaign: {
        title,
        description,
        cover: { isBinary: true },
    },
    publishment: {
        title,
        content: 'A new character will be added to campaign in next match',
    },
    uploadCampaignImages: { image: { isBinary: true } },
};

export default {
    generateCampaignsJSON,
    generateImagesObjectJSON,
    mocks,
};
