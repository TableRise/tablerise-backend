import chai from 'chai';

chai.use(require('dirty-chai'));
// @ts-expect-error Will create a new global property
global.expect = chai.expect;
