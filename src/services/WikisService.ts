import WikisModel from 'src/database/models/WikisModel';
import Service from 'src/types/Service';
import wikiZodSchema, { Wiki } from 'src/schemas/wikisValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class WikisServices implements Service<Internacional<Wiki>> {
    constructor(
        private readonly _model: WikisModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Wiki>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All wiki entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Wiki>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Wiki entity found with success');
        return this._validate.response(response, errorMessage.notFound.wiki);
    }

    public async update(_id: string, payload: Internacional<Wiki>): Promise<Internacional<Wiki>> {
        this._validate.entry(languagesWrapper(wikiZodSchema), payload, errorMessage.notFound.wiki);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Wiki entity updated with success');
        return this._validate.response(response, errorMessage.notFound.wiki);
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.wiki);

        await this._model.delete(_id);
    }
}
