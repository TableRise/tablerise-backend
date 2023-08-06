import GodsModel from 'src/database/models/GodsModel';
import Service from 'src/types/Service';
import godZodSchema, { God } from 'src/schemas/godsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class GodsServices implements Service<Internacional<God>> {
    constructor(
        private readonly _model: GodsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<God>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All god entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<God>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'God entity found with success');
        return this._validate.response(response, errorMessage.notFound.god);
    }

    public async update(_id: string, payload: Internacional<God>): Promise<Internacional<God>> {
        this._validate.entry(languagesWrapper(godZodSchema), payload, errorMessage.notFound.feat);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'God entity updated with success');
        return this._validate.response(response, errorMessage.notFound.god);
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.god);

        await this._model.delete(_id);
    }
}
