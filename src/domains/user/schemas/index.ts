import userZod from './usersValidationSchema';
import userDetailZod from './userDetailsValidationSchema';

const schemas = {
    userZod,
    userDetailZod,
};

export type SchemasUserType = typeof schemas;

export default schemas;
