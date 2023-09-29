import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/services/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { SchemasDnDType } from 'src/schemas';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import getErrorName from 'src/services/helpers/getErrorName';

export default class RacesServices implements Service<Internacional<Race>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Race>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

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

        this._logger('info', 'Race entity found with success');
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return response;
    }

    public async update(_id: string, payload: Internacional<Race>): Promise<Internacional<Race>> {
        const { helpers, raceZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(raceZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Race entity updated with success');
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

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
