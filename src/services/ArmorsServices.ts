import ArmorsModel from 'src/database/models/ArmorsModel';
import Service from 'src/types/Service';
import armorsZodSchema, { Armor } from 'src/schemas/armorsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import { LoggerType } from 'src/types/LoggerType';
import UpdateResponse from 'src/types/UpdateResponse';

export default class ArmorsServices extends ValidateEntry implements Service<Internacional<Armor>> {
    constructor(
        private readonly _model: ArmorsModel,
        private readonly _logger: LoggerType
    ) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Armor>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All armor entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Armor>>> {
        const response = await this._model.findAll({ active: false });

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
        this.validate(languagesWrapper(armorsZodSchema), payload);

        if (payload.active) {
            const err = new Error('Not authorized to change availability');
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            this._logger('error', err.message);
            throw err;
        }

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

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound an armor with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        if (response.active === query) {
            const err = new Error(`${query ? 'Entity already enabled' : 'Entity already disabled'}`);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            this._logger('error', err.message);
            throw err;
        }

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Armor ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Armor entity availability updated with success');
        return responseMessage;
    }
}
