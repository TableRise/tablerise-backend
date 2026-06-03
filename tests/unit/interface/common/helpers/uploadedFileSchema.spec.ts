import uploadedFileSchema from 'src/interface/common/helpers/uploadedFileSchema';

describe('Interface :: Common :: Helpers :: uploadedFileSchema', () => {
    it('should accept multer-like file objects', () => {
        expect(() =>
            uploadedFileSchema.parse({
                fieldname: 'picture',
                originalname: 'cover.png',
                mimetype: 'image/png',
                buffer: Buffer.from('cover'),
            })
        ).to.not.throw();
    });

    it('should reject primitive values', () => {
        expect(() => uploadedFileSchema.parse('invalid-upload')).to.throw('Invalid file upload');
    });

    it('should reject objects missing required file fields', () => {
        expect(() =>
            uploadedFileSchema.parse({
                originalname: 'cover.png',
                mimetype: 'image/png',
            })
        ).to.throw('Invalid file upload');
    });
});
