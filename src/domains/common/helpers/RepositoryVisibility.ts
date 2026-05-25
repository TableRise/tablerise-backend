import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

export const isClosedCampaign = (campaign: Partial<Campaign> | null | undefined): boolean =>
    campaign?.status === 'closed';

export const isUserWaitingToDelete = (user: Partial<User> | null | undefined): boolean =>
    user?.inProgress?.status === InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;

export const getCharacterCampaignId = (character: Partial<CharactersDnd> | null | undefined): string | null =>
    typeof character?.campaignId === 'string' && character.campaignId.length > 0 ? character.campaignId : null;

export const getCharacterAuthorUserId = (character: Partial<CharactersDnd> | null | undefined): string | null =>
    typeof character?.author?.userId === 'string' && character.author.userId.length > 0
        ? character.author.userId
        : null;
