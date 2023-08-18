import RealmsModel from 'src/database/models/RealmsModel';
import Service from 'src/types/Service';
import realmsZodSchema, { Realm } from 'src/schemas/realmsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
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
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);
        return response as Internacional<Realm>;
    }

    public async update(_id: string, payload: Internacional<Realm>): Promise<Internacional<Realm>> {
        this._validate.entry(languagesWrapper(realmsZodSchema), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Realm entity updated with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Realm>;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response?.active === query, ErrorMessage.BAD_REQUEST);

        if (response) response.active = query;
        await this._model.update(_id, response as Internacional<Realm>);

        const responseMessage = {
            message: `Realm ${response?._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Realm availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
