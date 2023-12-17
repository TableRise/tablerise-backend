import newUUID from 'src/domains/common/helpers/newUUID';
import { Armor } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';

function createArmorsFaker({
    entityId,
}: {
    entityId: string;
}): Internacional<Armor> & { armorId: string } {
    return {
        armorId: entityId || newUUID(),
        active: true,
        en: {
            type: 'Plate',
            name: 'Steel Plate',
            description: 'A sturdy steel plate armor for maximum protection.',
            cost: {
                value: 200,
                currency: 'gold',
            },
            weight: 30,
            armorClass: 18,
            requiredStrength: 15,
            stealthPenalty: true,
        },
        pt: {
            type: 'Placa',
            name: 'Placa de Aço',
            description: 'Uma armadura de placa de aço resistente para máxima proteção.',
            cost: {
                value: 200,
                currency: 'ouro',
            },
            weight: 30,
            armorClass: 18,
            requiredStrength: 15,
            stealthPenalty: true,
        },
    };
}

const dungeonsAndDragonsFunctions = {
    armors: createArmorsFaker,
};

export default function generateDungeonsAndDragonsFaker({
    count,
    entityId,
    entity,
}: {
    count: number;
    entityId: string | undefined;
    entity: string | undefined;
}): any[] {
    const entityArray: Array<Internacional<Armor>> = [];

    for (let index = 0; index <= count; index += 1) {
        entityArray.push(
            dungeonsAndDragonsFunctions[
                entity as keyof typeof dungeonsAndDragonsFunctions
            ]({ entityId } as { entityId: string })
        );
    }

    return entityArray;
}
