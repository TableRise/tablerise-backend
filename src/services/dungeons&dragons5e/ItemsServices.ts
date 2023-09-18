import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { SchemasDnDType } from 'src/schemas';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

export default class ItemsServices implements Service<Internacional<Item>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Item>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Item>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Item>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Item>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Item entity found with success');
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        return response;
    }

    public async update(_id: string, payload: Internacional<Item>): Promise<Internacional<Item>> {
        const { helpers, itemZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(itemZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Item entity updated with success');
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

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
