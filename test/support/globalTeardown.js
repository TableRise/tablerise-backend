const { mongoose, default: DatabaseManagement } = require('@tablerise/database-management');

async function teardown() {
    await new DatabaseManagement().modelInstance('user', 'Users').delete('6530214e4006e8046e11b723');
    await new DatabaseManagement().modelInstance('user', 'UserDetails').delete('653021554006e8046e11b727');
    await mongoose.connection.close();
}

module.exports = teardown;
