import ItemsModel from 'src/database/models/ItemsModel';
import Service from 'src/types/Service';
import ItemZodSchema, { Item } from 'src/schemas/itemsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class ItemsServices implements Service<Internacional<Item>> {
    constructor(
        private readonly _model: ItemsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Item>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Item>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Item entity found with success');
        return this._validate.response(response, errorMessage.notFound.item);
    }

    public async update(_id: string, payload: Internacional<Item>): Promise<Internacional<Item>> {
        this._validate.entry(languagesWrapper(ItemZodSchema), payload);
        const response = await this._model.update(_id, payload);

        this._logger('info', 'Item entity updated with success');
        return this._validate.response(response, errorMessage.notFound.item);
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.item);

        await this._model.delete(_id);
    }
}
