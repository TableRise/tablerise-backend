import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';
import { isValidObjectId } from 'mongoose';

describe('Helpers :: GenerateNewMongoID', () => {
    describe('When called', () => {
        it('should return a valid mongo ID string', () => {
            const newID = generateNewMongoID();
            const isValidMongoID = isValidObjectId(newID);

            expect(typeof newID).toBe('string');
            expect(isValidMongoID).toBe(true);
        });
    });
});
