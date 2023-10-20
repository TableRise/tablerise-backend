import dungeonsAndDragons5eSchemas from './dungeons&dragons5e';
import languagesWrapperSchema from './languagesWrapperSchema';
import updateContentZodSchema from './updateContentSchema';
import userSchemas from '../interface/users/schemas';

const schemas = {
    'dungeons&dragons5e': {
        ...dungeonsAndDragons5eSchemas,
        updateContentZodSchema,
        helpers: { languagesWrapperSchema },
    },
    user: {
        ...userSchemas,
    },
};

export type SchemasDnDType = (typeof schemas)['dungeons&dragons5e'];
export type SchemasUserType = typeof schemas.user;
export default schemas;
