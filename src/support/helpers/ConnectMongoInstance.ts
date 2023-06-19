/* eslint-disable no-console */
import mongoose from 'mongoose';

export default class ConnectMongoInstance {
  constructor(
    readonly _username: string,
    readonly _password: string,
    readonly _host: string,
    readonly _port: number,
    readonly _database: string,
    readonly _connectionInitial: string
  ) {}

  public async connect(): Promise<void> {
    await mongoose
      .connect(`${this._connectionInitial}://${this._username}:
      ${this._password}@${this._host}:${this._port}/${this._database}`)
      .then(() => { console.log('MongoDB connected successfully') })
      .catch((err) => { throw err });
  }
}
