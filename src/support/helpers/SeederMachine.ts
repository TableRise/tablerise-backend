/* eslint-disable no-console */
import SystemsModel from 'src/database/models/SystemsModel';
import systemZodSchema, { ISystem } from 'src/schemas/systemsValidationSchema';
import ConnectMongoInstance from './ConnectMongoInstance';
import ValidateEntry from './ValidateEntry';

export default class Seeder extends ValidateEntry {
  constructor(readonly env: string) {
    super();
  }

  private async _stablishConnection(): Promise<void> {
    if (this.env === 'test') {
      await ConnectMongoInstance.connectInTest();
    }

    if (this.env === 'prod' || this.env === 'dev') {
      await ConnectMongoInstance.connect();
    }
  }

  public async systems(data: ISystem[]): Promise<boolean> {
    try {
      await this._stablishConnection();

      const model = new SystemsModel();
      const requests: Array<Promise<ISystem>> = [];

      data.forEach((singleData) => {
        this.validate(systemZodSchema, singleData);
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
