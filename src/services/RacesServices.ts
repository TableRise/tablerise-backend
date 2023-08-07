import RacesModel from 'src/database/models/RacesModel';
import Service from 'src/types/Service';
import RaceZodSchema, { Race } from 'src/schemas/racesValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import { LoggerType } from 'src/types/LoggerType';
import UpdateResponse from 'src/types/UpdateResponse';

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

    public async findAllDisabled(): Promise<Array<Internacional<Race>>> {
        const response = await this._model.findAll({ active: false });

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

        if (payload.active) {
            const err = new Error('Not possible to change availability through this route');
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            throw err;
        }

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

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a race with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        if (response.active === query) {
            const err = new Error(`${query ? 'Entity already enabled' : 'Entity already disabled'}`);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            this._logger('error', err.message);
            throw err;
        }

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Race ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Race entity availability updated with success');
        return responseMessage;
    }
}
