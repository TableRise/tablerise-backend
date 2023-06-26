/* eslint-disable no-console */
import mongoose from 'mongoose';

export default function connect(): void {
  const firstSection = 'mongodb://root:secret';
  const secondSection = '@127.0.0.1:27018/tablerise-test?authSource=admin';

  mongoose
    .connect(firstSection + secondSection)
    .then(() => { console.log('MongoDB Instance Connected') })
    .catch((error) => { throw error });
}
