const { mongoose } = require('@tablerise/database-management');

async function teardown() {
    await mongoose.connection.close();
}

module.exports = teardown;
