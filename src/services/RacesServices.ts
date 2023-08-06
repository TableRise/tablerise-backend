import RacesModel from 'src/database/models/RacesModel';
import Service from 'src/types/Service';
import RaceZodSchema, { Race } from 'src/schemas/racesValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import { LoggerType } from 'src/types/LoggerType';

export default class RacesServices extends ValidateEntry implements Service<Internacional<Race>> {
    constructor(
        private readonly _model: RacesModel,
        private readonly _logger: LoggerType
    ) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Race>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All race entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Race>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a race with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Race entity found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Race>): Promise<Internacional<Race>> {
        this.validate(languagesWrapper(RaceZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a race with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Race entity updated with success');
        return response;
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

<<<<<<< HEAD
        this.validateResponse(response, 'Race');
=======
        if (!response) {
            const err = new Error('NotFound a race with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }
>>>>>>> 86635c617ff33d2205d8e5dce045247b3d64ac07

        await this._model.delete(_id);
    }
}
