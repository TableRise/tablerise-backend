/* eslint-disable @typescript-eslint/ban-ts-comment */
import FeatsModel from 'src/database/models/FeatsModel';
import Service from 'src/types/Service';
import featZodSchema, { Feat } from 'src/schemas/featsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import UpdateResponse from 'src/types/UpdateResponse';
import { LoggerType } from 'src/types/LoggerType';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';

export default class FeatsServices implements Service<Internacional<Feat>> {
    constructor(
        private readonly _model: FeatsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

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

        this._logger('info', 'Feat entity found with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Feat>;
    }

    public async update(_id: string, payload: Internacional<Feat>): Promise<Internacional<Feat>> {
        this._validate.entry(languagesWrapper(featZodSchema), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Feat entity updated with success');
        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        return response as Internacional<Feat>;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response?.active === query, ErrorMessage.BAD_REQUEST);

        if (response) response.active = query;
        await this._model.update(_id, response as Internacional<Feat>);

        const responseMessage = {
            message: `Feat ${response?._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Feat availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
