import RealmsModel from 'src/database/models/dungeons&dragons5e/RealmsModel';
import Service from 'src/types/Service';
import realmsZodSchema, { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { errorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';

export default class RealmsServices implements Service<Internacional<Realm>> {
    constructor(
        private readonly _model: RealmsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Realm>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All realm entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Realm>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All realm entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Realm>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Realm entity found with success');
        return this._validate.response(response, errorMessage.notFound.realm);
    }

    public async update(_id: string, payload: Internacional<Realm>): Promise<Internacional<Realm>> {
        this._validate.entry(languagesWrapper(realmsZodSchema), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Realm entity updated with success');
        return this._validate.response(response, errorMessage.notFound.realm);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.realm);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Realm ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Realm availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
