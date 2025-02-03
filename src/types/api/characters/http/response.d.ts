import { Author, Profile } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export interface CharacterToPlayerRecover {
    author: Author;
    picture: ImageObject;
    profile: Profile;
}
