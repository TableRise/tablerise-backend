import WikisModel from 'src/database/models/dungeons&dragons5e/WikisModel';
import Service from 'src/types/Service';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import wikiZodSchema, { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default class WikisServices implements Service<Internacional<Wiki>> {
    constructor(
        private readonly _model: WikisModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Wiki>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All wiki entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Wiki>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Wiki entity found with success');
        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Wiki>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All wiki entities found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Wiki>): Promise<Internacional<Wiki>> {
        this._validate.entry(languagesWrapper(wikiZodSchema), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Wiki entity updated with success');
        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Wiki ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Wiki entity availability updated with success');
        return responseMessage;
    }
}
