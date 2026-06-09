import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';

chai.use(dirtyChai);
chai.use(sinonChai);
// @ts-expect-error Will create a new global property
global.expect = chai.expect;

process.env.MESSAGE_ENCRYPTION_KEY = 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=';
