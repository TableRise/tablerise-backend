import BackgroundsModel from 'src/database/models/BackgroundsModel';
import Service from 'src/types/Service';
import backgroundZodSchema, { Background } from 'src/schemas/backgroundsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class BackgroundsServices implements Service<Internacional<Background>> {
    constructor(
        private readonly _model: BackgroundsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Background>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All background entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Background>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Background entity found with success');
        return (this._validate.response(response, errorMessage.notFound.background));
    }

    public async update(_id: string, payload: Internacional<Background>): Promise<Internacional<Background>> {
        this._validate.entry(languagesWrapper(backgroundZodSchema), payload, errorMessage.notFound.background);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Background entity updated with success');
        return (this._validate.response(response, errorMessage.notFound.background));
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.background);

        await this._model.delete(_id);
    }
}
