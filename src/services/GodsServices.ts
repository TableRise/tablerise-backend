import GodsModel from 'src/database/models/GodsModel';
import Service from 'src/types/Service';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import godZodSchema, { God } from 'src/schemas/godsValidationSchema';

export default class GodsServices implements Service<Internacional<God>> {
    constructor(
        private readonly _model: GodsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<God>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All god entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<God>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All god entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<God>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'God entity found with success');
        return this._validate.response(response, errorMessage.notFound.god);
    }

    public async update(_id: string, payload: Internacional<God>): Promise<Internacional<God>> {
        this._validate.entry(languagesWrapper(godZodSchema), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'God entity updated with success');
        return this._validate.response(response, errorMessage.notFound.god);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.god);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `God ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `God availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
