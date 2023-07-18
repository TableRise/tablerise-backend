import WeaponsModel from 'src/database/models/WeaponsModel';
import Service from 'src/types/Service';
import weaponsZodSchema, { Weapon } from 'src/schemas/weaponsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class WeaponsServices
  extends ValidateEntry
  implements Service<Internacional<Weapon>> {
  constructor(private readonly _model: WeaponsModel) {
    super();
  }

  public async findAll(): Promise<Array<Internacional<Weapon>>> {
    const response = await this._model.findAll();
    return response;
  };

  public async findOne(_id: string): Promise<Internacional<Weapon>> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('NotFound a weapon with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async update(_id: string, payload: Internacional<Weapon>): Promise<Internacional<Weapon>> {
    this.validate(languagesWrapper(weaponsZodSchema), payload);

    const response = await this._model.update(_id, payload);

    if (!response) {
      const err = new Error('NotFound a weapon with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async delete(_id: string): Promise<void> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('NotFound a weapon with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    await this._model.delete(_id);
  };
}
