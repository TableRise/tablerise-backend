import schema from 'src/schemas';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import languagesWrapperSchema, { Internacional } from 'src/infra/helpers/languagesWrapperZod';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: ArmorsValidationSchema', () => {
    const armor = mock.armor.instance.en as Armor;
    const armorInstance = mock.armor.instance as Internacional<Armor>;

    describe('When schema is wrapped to internacional schema', () => {
        it('should not return errors', () => {
            const schemaArmor = schema['dungeons&dragons5e'].armorZod;
            const schemaArmorInternacional = languagesWrapperSchema(schemaArmor);
            const resultError = schemaArmorInternacional.safeParse(armor);
            const resultSuccess = schemaArmorInternacional.safeParse(armorInstance);

            expect(resultError.success).toBe(false);
            expect(resultSuccess.success).toBe(true);
        });
    });
});
