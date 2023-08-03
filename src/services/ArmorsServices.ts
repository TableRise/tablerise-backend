import ArmorsModel from 'src/database/models/ArmorsModel';
import Service from 'src/types/Service';
import armorZodSchema, { Armor } from 'src/schemas/armorsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import { LoggerType } from 'src/types/LoggerType';

export default class ArmorsServices extends ValidateEntry implements Service<Internacional<Armor>> {
    constructor(
        private readonly _model: ArmorsModel,
        private readonly _logger: LoggerType
    ) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Armor>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All armor entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Armor>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound an armor with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Armor entity found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Armor>): Promise<Internacional<Armor>> {
        this.validate(languagesWrapper(armorZodSchema), payload);

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound an armor with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Armor entity updated with success');
        return response;
    }

    public async delete(_id: string): Promise<void> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound an armor with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        await this._model.delete(_id);
    }
}
