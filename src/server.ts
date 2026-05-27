/* eslint-disable import/first */
import path from 'path';

if (__dirname.includes(`${path.sep}build${path.sep}`)) {
    require('module-alias/register');
}

import setup, { container } from './container';
setup();
container.resolve('application').start();
