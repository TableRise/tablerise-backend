import { ISchemaProps } from 'src/types/shared/configs';

export interface ICharactersSchemas {
    postCreateCharacter: ISchemaProps;
    putUpdateCharacter: ISchemaProps;
    postCharacterPicture: ISchemaProps;
    patchAddEquipment: ISchemaProps;
    patchRemoveEquipment: ISchemaProps;
    patchUpdateMoney: ISchemaProps;
}
