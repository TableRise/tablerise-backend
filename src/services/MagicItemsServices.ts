import MagicItemsModel from 'src/database/models/MagicItemsModel';
import Service from 'src/types/Service';
import magicItemZodSchema, { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import UpdateResponse from 'src/types/UpdateResponse';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class MagicItemsServices implements Service<Internacional<MagicItem>> {
    constructor(
        private readonly _model: MagicItemsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<MagicItem>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All magic item entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<MagicItem>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All magic item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<MagicItem>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Magic item entity found with success');
        return this._validate.response(response, errorMessage.notFound.magicItem);
    }

    public async update(_id: string, payload: Internacional<MagicItem>): Promise<Internacional<MagicItem>> {
        this._validate.entry(languagesWrapper(magicItemZodSchema), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Magic item entity updated with success');
        return this._validate.response(response, errorMessage.notFound.magicItem);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.magicItem);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Magic Items ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Magic Item availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
