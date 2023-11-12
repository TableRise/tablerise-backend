import userZod, { emailUpdateZodSchema } from './usersValidationSchema';
import userDetailZod from './userDetailsValidationSchema';
import { oAuthCompleteZodSchema } from './oAuthValidationSchema';

const schemas = {
    userZod,
    userDetailZod,
    emailUpdateZod: emailUpdateZodSchema,
    oAuthComplete: oAuthCompleteZodSchema
};

export type SchemasUserType = typeof schemas;

export default schemas;
