import GodsModel from 'src/database/models/GodsModel';
import Service from 'src/types/Service';
import godZodSchema, { God } from 'src/schemas/godsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class GodsServices
  extends ValidateEntry
  implements Service<Internacional<God>> {
  constructor(private readonly _model: GodsModel) {
    super();
  }

  public async findAll(): Promise<Array<Internacional<God>>> {
    const response = await this._model.findAll();
    return response;
  };

  public async findOne(_id: string): Promise<Internacional<God>> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('NotFound a god with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async update(_id: string, payload: Internacional<God>): Promise<Internacional<God>> {
    this.validate(languagesWrapper(godZodSchema), payload);

    const response = await this._model.update(_id, payload);

    if (!response) {
      const err = new Error('NotFound a god with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    return response;
  }

  public async delete(_id: string): Promise<void> {
    const response = await this._model.findOne(_id);

    if (!response) {
      const err = new Error('NotFound a god with provided ID');
      err.stack = HttpStatusCode.NOT_FOUND.toString();
      err.name = 'NotFound'

      throw err;
    }

    await this._model.delete(_id);
  };
}
