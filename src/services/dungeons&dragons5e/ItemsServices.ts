import { DnDItem, MongoModel, Internacional, SchemasDnDType } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { errorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';

export default class ItemsServices implements Service<Internacional<DnDItem>> {
    constructor(
        private readonly _model: MongoModel<Internacional<DnDItem>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<DnDItem>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<DnDItem>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<DnDItem>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Item entity found with success');
        return this._validate.response(response, errorMessage.notFound.item);
    }

    public async update(_id: string, payload: Internacional<DnDItem>): Promise<Internacional<DnDItem>> {
        const { helpers, itemZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(itemZod), payload);

        this._validate.active(payload.active, errorMessage.badRequest.default.payloadActive);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Item entity updated with success');
        return this._validate.response(response, errorMessage.notFound.item);
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        let response = await this._model.findOne(_id);

        response = this._validate.response(response, errorMessage.notFound.item);

        this._validate.active(response.active === query, errorMessage.badRequest.default.responseActive(query));

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Item ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Item entity availability updated with success');
        return responseMessage;
    }
}
