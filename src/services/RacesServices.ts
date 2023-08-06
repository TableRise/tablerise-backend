import RacesModel from 'src/database/models/RacesModel';
import Service from 'src/types/Service';
import RaceZodSchema, { Race } from 'src/schemas/racesValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class RacesServices implements Service<Internacional<Race>> {
    constructor(
        private readonly _model: RacesModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Race>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All race entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Race>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Race entity found with success');
        return this._validate.response(response, errorMessage.notFound.race);
    }

    public async update(_id: string, payload: Internacional<Race>): Promise<Internacional<Race>> {
        this._validate.entry(languagesWrapper(RaceZodSchema), payload, errorMessage.notFound.race);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Race entity updated with success');
        return this._validate.response(response, errorMessage.notFound.race);
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.race);

        await this._model.delete(_id);
    }
}
