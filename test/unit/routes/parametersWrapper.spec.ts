import generateIDParam, { generateHeaderParam, generateQueryParam } from "src/routes/parametersWrapper";

describe('Routes :: ParametersWrapper', () => {
    describe('When generate an id', () => {
        it('should return an array with correct param', () => {
            const param = generateIDParam();
    
            expect(param).toHaveLength(1);
            expect(param[0].name).toBe('_id');
            expect(param[0].location).toBe('path');
            expect(param[0].required).toBe(true);
            expect(param[0].type).toBe('string');
        });
    });

    describe('When generate a query', () => {
        it('should return an array with correct param', () => {
            const param = generateQueryParam(2, [
                {
                    name: 'active',
                    type: 'boolean'
                },
                {
                    name: 'showForm',
                    type: 'string'
                }
            ]);
    
            expect(param).toHaveLength(2);
            expect(param[0].name).toBe('active');
            expect(param[0].location).toBe('query');
            expect(param[0].required).toBe(true);
            expect(param[0].type).toBe('boolean');

            expect(param[1].name).toBe('showForm');
            expect(param[1].location).toBe('query');
            expect(param[1].required).toBe(true);
            expect(param[1].type).toBe('string');
        });
    });

    describe('When generate a header', () => {
        it('should return an array with correct param', () => {
            const param = generateHeaderParam(1, [{ name: 'test', type: 'number' }]);
    
            expect(param).toHaveLength(1);
            expect(param[0].name).toBe('test');
            expect(param[0].location).toBe('header');
            expect(param[0].required).toBe(true);
            expect(param[0].type).toBe('number');
        });
    });
});