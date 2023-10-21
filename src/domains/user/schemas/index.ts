import userZod, { emailUpdateZodSchema } from './usersValidationSchema';
import userDetailZod from './userDetailsValidationSchema';

const schemas = {
    userZod,
    userDetailZod,
    emailUpdateZod: emailUpdateZodSchema
};

export type SchemasUserType = typeof schemas;

export default schemas;
