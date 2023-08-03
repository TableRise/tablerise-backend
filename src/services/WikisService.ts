import WikisModel from 'src/database/models/WikisModel';
import Service from 'src/types/Service';
import wikiZodSchema, { Wiki } from 'src/schemas/wikisValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateData';

export default class WikisServices extends ValidateEntry implements Service<Internacional<Wiki>> {
    constructor(private readonly _model: WikisModel) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Wiki>>> {
        const response = await this._model.findAll();
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Wiki>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a wiki with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async update(_id: string, payload: Internacional<Wiki>): Promise<Internacional<Wiki>> {
        this.validate(languagesWrapper(wikiZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a wiki with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        return response;
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a wiki with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        await this._model.delete(_id);
    }
}
