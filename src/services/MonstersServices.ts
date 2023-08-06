import MonstersModel from 'src/database/models/MonstersModel';
import Service from 'src/types/Service';
import monstersZodSchema, { Monster } from 'src/schemas/monstersValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import { LoggerType } from 'src/types/LoggerType';
import { errorMessage } from 'src/support/helpers/errorMessage';

export default class MonstersService  implements Service<Internacional<Monster>> {
    constructor(
        private readonly _model: MonstersModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<Array<Internacional<Monster>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All monster entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Monster>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Monster entity found with success');
        return (this._validate.response(response, errorMessage.notFound.monster));
    }

    public async update(_id: string, payload: Internacional<Monster>): Promise<Internacional<Monster>> {
        this._validate.entry(languagesWrapper(monstersZodSchema), payload, errorMessage.notFound.monster);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Monster entity updated with success');
        return (this._validate.response(response, errorMessage.notFound.monster));
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

       this._validate.response(response, errorMessage.notFound.monster);

        await this._model.delete(_id);
    }
}
