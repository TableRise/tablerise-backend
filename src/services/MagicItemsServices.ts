import MagicItemsModel from 'src/database/models/MagicItemsModel';
import Service from 'src/types/Service';
import magicItemZodSchema, { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';


export default class MagicItemsServices implements Service<Internacional<MagicItem>> {
    constructor(
        private readonly _model: MagicItemsModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) { }

    public async findAll(): Promise<Array<Internacional<MagicItem>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All magic item entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<MagicItem>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Magic item entity found with success');
        return (this._validate.response(response, errorMessage.notFound.magicItem));
    }

    public async update(_id: string, payload: Internacional<MagicItem>): Promise<Internacional<MagicItem>> {
        this._validate.entry(languagesWrapper(magicItemZodSchema), payload, errorMessage.notFound.magicItem);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Magic item entity updated with success');
        return (this._validate.response(response, errorMessage.notFound.magicItem));
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        this._validate.response(response, errorMessage.notFound.magicItem);

        await this._model.delete(_id);
    }
}
