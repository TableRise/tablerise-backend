import FeatsModel from 'src/database/models/FeatsModel';
import Service from 'src/types/Service';
import featZodSchema, { Feat } from 'src/schemas/featsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class FeatsServices implements Service<Internacional<Feat>> {
    constructor(
        private readonly _model: FeatsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Feat>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All feat entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Feat>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Feat entity found with success');
        return this._validate.response(response, errorMessage.notFound.feat);
    }

    public async update(_id: string, payload: Internacional<Feat>): Promise<Internacional<Feat>> {
        this._validate.entry(languagesWrapper(featZodSchema), payload, errorMessage.notFound.feat);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Feat entity updated with success');
        return this._validate.response(response, errorMessage.notFound.feat);
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.feat);

        await this._model.delete(_id);
    }
}
