import request from 'supertest';
import app from '../../src/app';

const defaults = require('superagent-defaults');

const requester = defaults(request(app));

export default requester;
