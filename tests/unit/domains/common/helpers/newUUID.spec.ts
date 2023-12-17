import newUUID from 'src/domains/common/helpers/newUUID';
import { validate } from 'uuid';

describe('Domains :: Common :: Helpers :: newUUID', () => {
    context('When called', () => {
        it('should return a valid UUID', () => {
            const id = newUUID();
            const isValid = validate(id);

            expect(typeof id).to.be.equal('string');
            expect(isValid).to.be.equal(true);
        });
    });
});
