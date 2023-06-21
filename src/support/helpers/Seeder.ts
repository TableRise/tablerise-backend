/* eslint-disable no-console */
import SystemsModel from 'src/database/models/SystemsModel';
import systemZodSchema, { ISystem } from 'src/schemas/systemsValidationSchema';
import ConnectMongoInstance from './ConnectMongoInstance';
import ValidateEntry from './ValidateEntry';

export default class Seeder {
  constructor(readonly env: string) {}

  private async _stablishConnection(): Promise<void> {
    if (this.env === 'test') {
      await ConnectMongoInstance.connectInTest();
    }

    if (this.env === 'prod') {
      await ConnectMongoInstance.connect();
    }
  }

  private async _envCheck(): Promise<void> {
    if (this.env === 'test' || this.env === 'prod') {
      console.log('Stablishing connection with mongodb instance');
      await this._stablishConnection();
    }
  }

  public async systems(data: ISystem[]): Promise<boolean> {
    try {
      await this._envCheck();

      const model = new SystemsModel();
      const requests: Array<Promise<ISystem>> = [];

      data.forEach((singleData) => {
        new ValidateEntry().validate(systemZodSchema, singleData);
        requests.push(model.create(singleData));
      });

      await Promise.all(requests);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
