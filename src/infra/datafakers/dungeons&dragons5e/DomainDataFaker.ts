import { DungeonsAndDragonsJSONPayload } from 'src/types/dungeons&dragons5e/datafakers/Payload';
import generateDungeonsAndDragonsFaker from './generators/generateDungeonsAndDragonsFaker';

function generateDungeonsAndDragonsJSON(
    { count, entityId, entity }: DungeonsAndDragonsJSONPayload = { count: 1 }
): any[] {
    return generateDungeonsAndDragonsFaker({ count, entityId, entity });
}

export default {
    generateDungeonsAndDragonsJSON,
};
