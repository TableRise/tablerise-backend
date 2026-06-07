import {
    TCreateCharacterBody,
    TUpdateCharacterBody,
} from 'src/interface/characters/presentation/character/CharactersSchemas';
import { FileObject } from 'src/types/shared/file';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

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
    userId: string;
    image?: FileObject;
    imageObject?: ImageObject;
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

export interface UpdateCharacterMoneyPayload {
    characterId: string;
    operation: 'add' | 'subtract';
    money: number;
    moneyType: 'PC' | 'PP' | 'PE' | 'PO' | 'PL';
}

export interface DeleteCharacterPayload {
    characterId: string;
    userId: string;
}
