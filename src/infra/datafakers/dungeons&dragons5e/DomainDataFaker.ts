import { DungeonsAndDragonsJSONPayload } from 'src/types/modules/infra/datafakers/dungeons&dragons5e/DomainDataFaker';
import generateDungeonsAndDragonsFaker from './generators/generateDungeonsAndDragonsFaker';

function generateDungeonsAndDragonsJSON(
    { count, entityId, entity }: DungeonsAndDragonsJSONPayload = { count: 1 }
): any[] {
    return generateDungeonsAndDragonsFaker({ count, entityId, entity });
}

export default {
    generateDungeonsAndDragonsJSON,
};
