import DatabaseManagement, { mongoose } from '@tablerise/database-management';

const Database = new DatabaseManagement();

const User = Database.modelInstance('user', 'Users');
const UserDetails = Database.modelInstance('user', 'UserDetails');

export default {
    Database,
    mongoose,
    models: {
        User,
        UserDetails,
    },
};
