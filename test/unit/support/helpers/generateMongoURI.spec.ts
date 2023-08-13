import generateMongoURI from 'src/support/helpers/generateMongoURI';

describe('Support :: Helpers :: GenerateMongoURI', () => {
    describe('When called', () => {
        it('should return a valid mongo URI', () => {
            const URI = generateMongoURI('');
            expect(URI).toBe('mongodb://root:secret@127.0.0.1:27018/dungeons&dragons5e?authSource=admin')
        });
    });
});
