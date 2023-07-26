import BackgroundsModel from 'src/database/models/BackgroundsModel';
import Service from 'src/types/Service';
import backgroundZodSchema, { Background } from 'src/schemas/backgroundsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';

export default class BackgroundsServices extends ValidateEntry implements Service<Internacional<Background>> {
    constructor(private readonly _model: BackgroundsModel) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Background>>> {
        const response = await this._model.findAll();
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Background>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a background with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async update(_id: string, payload: Internacional<Background>): Promise<Internacional<Background>> {
        this.validate(languagesWrapper(backgroundZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a background with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    // public async delete(_id: string): Promise<void> {
    //     const response = await this._model.findOne(_id);

    //     if (!response) {
    //         const err = new Error('NotFound a background with provided ID');
    //         err.stack = HttpStatusCode.NOT_FOUND.toString();
    //         err.name = 'NotFound';

    //         throw err;
    //     }

    //     await this._model.delete(_id);
    // }
}
