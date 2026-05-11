import {
    TCreateCharacterBody,
    TUpdateCharacterBody,
} from 'src/interface/characters/presentation/character/CharactersSchemas';
import { FileObject } from 'src/types/shared/file';

export interface CreateCharacterPayload {
    payload: TCreateCharacterBody;
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
export interface orgPicturePayload {
    orgName: string;
    characterId: string;
    image: FileObject;
}

export interface updateCharacterPayload {
    characterId: string;
    payload: TUpdateCharacterBody;
}

export interface ManageEquipmentPayload {
    characterId: string;
    equipmentId: string;
}
