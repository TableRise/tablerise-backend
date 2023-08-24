import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { mongoose } from '@tablerise/database-management';

describe('Helpers :: GenerateNewMongoID', () => {
    describe('When called', () => {
        it('should return a valid mongo ID string', () => {
            const newID = generateNewMongoID();
            const isValidMongoID = mongoose.isValidObjectId(newID);

            expect(typeof newID).toBe('string');
            expect(isValidMongoID).toBe(true);
        });
    });
});
