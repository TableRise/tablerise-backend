/* eslint-disable no-console */
import mongoose from 'mongoose';

export function connect(): void {
  const firstSection = 'mongodb://root:secret';
  const secondSection = '@127.0.0.1:27018/tablerise-test?authSource=admin';

  mongoose
    .connect(firstSection + secondSection)
    .then(() => {})
    .catch((error) => { throw error });
}

export async function close(): Promise<void> {
  await mongoose.connection.close();
}
