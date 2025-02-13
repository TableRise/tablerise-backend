import { CharacterPayload } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { FileObject } from 'src/types/shared/file';

export interface CreateCharacterPayload {
    payload: CharacterPayload;
    userId: string;
}

export interface GetCharacterByCampaignPayload {
    userId: string;
    campaignId: string;
}

export interface UpdateCharacterPicturePayload {
    characterId: string;
    image: FileObject;
}
