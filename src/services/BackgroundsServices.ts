import BackgroundsModel from 'src/database/models/BackgroundsModel';
import Service from 'src/types/Service';
import backgroundZodSchema, { Background } from 'src/schemas/backgroundsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import UpdateResponse from 'src/types/UpdateResponse';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';

export default class BackgroundsServices implements Service<Internacional<Background>> {
    constructor(
        private readonly _model: BackgroundsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Background>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All background entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Background>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All background entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Background>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Background entity found with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Background>;
    }

    public async update(_id: string, payload: Internacional<Background>): Promise<Internacional<Background>> {
        this._validate.entry(languagesWrapper(backgroundZodSchema), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Background entity updated with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Background>;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response?.active === query, ErrorMessage.BAD_REQUEST);

        if (response) response.active = query;
        await this._model.update(_id, response as Internacional<Background>);

        const responseMessage = {
            message: `Background ${response?._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Background availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
