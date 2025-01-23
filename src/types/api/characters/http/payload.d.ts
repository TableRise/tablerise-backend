import { CharacterPayload } from 'src/domains/characters/schemas/characterPostValidationSchema';

export interface CreateCharacterPayload {
    payload: CharacterPayload;
    userId: string;
}
