import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import { CampaignJSONPayload } from 'src/types/modules/infra/datafakers/campaigns/DomainDataFaker';
import dataGenerator from '../dataGenerator';

function createCampaignFaker({ campaignId = newUUID() }: Campaign): Campaign {
    return {
        campaignId,
        title: dataGenerator.title,
        code: dataGenerator.code,
        description: dataGenerator.description,
        visibility: dataGenerator.visibility,
        system: dataGenerator.system,
        ageRestriction: dataGenerator.ageRestriction,
        cover: dataGenerator.cover,
        campaignPlayers: dataGenerator.campaignPlayers,
        matchData: dataGenerator.matchData,
        infos: { ...dataGenerator.infos },
        password: dataGenerator.password,
        lores: dataGenerator.lores,
        images: dataGenerator.images,
        createdAt: dataGenerator.createdAt.toISOString(),
        updatedAt: dataGenerator.updatedAt.toISOString(),
    } as unknown as Campaign;
}

export default function generateCampaignsFaker({ count, campaignId }: CampaignJSONPayload): Campaign[] {
    const campaigns: Campaign[] = [];

    for (let index = 0; index < count; index += 1) {
        campaigns.push(createCampaignFaker({ campaignId } as Campaign));
    }

    return campaigns;
}
