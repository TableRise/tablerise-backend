import parseRequestJsonField from 'src/interface/common/helpers/parseRequestJsonField';

describe('Interface :: Common :: Helpers :: parseRequestJsonField', () => {
    it('should return undefined for empty request fields', () => {
        expect(parseRequestJsonField(undefined)).to.equal(undefined);
        expect(parseRequestJsonField(null)).to.equal(undefined);
        expect(parseRequestJsonField('')).to.equal(undefined);
    });

    it('should return non-string values as-is', () => {
        const imageObject = {
            id: 'image-1',
            link: 'https://img.bb/image',
        };

        expect(parseRequestJsonField(imageObject)).to.equal(imageObject);
    });

    it('should parse valid JSON strings', () => {
        expect(parseRequestJsonField('{"id":"image-1"}')).to.deep.equal({ id: 'image-1' });
    });

    it('should return the raw string when JSON parsing fails', () => {
        expect(parseRequestJsonField('{invalid-json}')).to.equal('{invalid-json}');
    });
});
