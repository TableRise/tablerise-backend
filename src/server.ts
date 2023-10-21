/* eslint-disable import/first */
import 'module-alias/register';
import setup, { container } from './container';
setup();
container.Application.start();
