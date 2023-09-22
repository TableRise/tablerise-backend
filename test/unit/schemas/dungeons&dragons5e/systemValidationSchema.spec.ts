import schema from 'src/schemas';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import mock from 'src/support/mocks/dungeons&dragons5e';

describe('Schemas :: DungeonsAndDragons5e :: SystemsValidationSchema', () => {
    const system = mock.system.instance as System;

    describe('When data is correct', () => {
        it('should not return errors', () => {
            const result = schema['dungeons&dragons5e'].systemZod.systemZod.safeParse(system);
            expect(result.success).toBe(true);
        });
    });

    describe('When data is incorrect', () => {
        it('should return errors', () => {
            const { name: _, ...systemWithoutCost } = system;
            const result = schema['dungeons&dragons5e'].systemZod.systemZod.safeParse(systemWithoutCost);
            expect(result.success).toBe(false);
        });
    });
});
