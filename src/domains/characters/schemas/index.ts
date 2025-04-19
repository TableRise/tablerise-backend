import characterPostZod from './characterPostValidationSchema';
import characterPutZod from './characterPutValidationSchema';

const schemas = {
    characterPostZod,
    characterPutZod
};

export type SchemasCharacterType = typeof schemas;

export default schemas;
