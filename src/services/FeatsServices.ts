import FeatsModel from 'src/database/models/FeatsModel';
import Service from 'src/types/Service';
import featZodSchema, { Feat } from 'src/schemas/featsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import UpdateResponse from 'src/types/UpdateResponse';
import { LoggerType } from 'src/types/LoggerType';

export default class FeatsServices extends ValidateEntry implements Service<Internacional<Feat>> {
    constructor(
        private readonly _model: FeatsModel,
        private readonly _logger: LoggerType
    ) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Feat>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All feat entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Feat>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All feat entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Feat>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a feat with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Feat entity found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Feat>): Promise<Internacional<Feat>> {
        this.validate(languagesWrapper(featZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a feat with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Feat entity updated with success');
        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a feat with provided ID');
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
            message: `Feat ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Feat availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
