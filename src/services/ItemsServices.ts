import ItemsModel from 'src/database/models/ItemsModel';
import Service from 'src/types/Service';
import ItemZodSchema, { Item } from 'src/schemas/itemsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';

export default class ItemsServices implements Service<Internacional<Item>> {
    constructor(
        private readonly _model: ItemsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) { }

    public async findAll(): Promise<Array<Internacional<Item>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Item>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound an item with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Item entity found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Item>): Promise<Internacional<Item>> {
        this._validate.entry(languagesWrapper(ItemZodSchema), payload, 'Item');
        console.log(ItemsServices.name, "L$!!@<<<<<<<<<<<<<<<<<<<<<<<<")
        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound an item with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Item entity updated with success');
        return response;
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound an item with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        await this._model.delete(_id);
    }
}
