import SpellsModel from 'src/database/models/SpellsModel';
import Service from 'src/types/Service';
import spellsZodSchema, { Spell } from 'src/schemas/spellsValidationSchema';
import languagesWrapper, { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import { LoggerType } from 'src/types/LoggerType';
import UpdateResponse from 'src/types/UpdateResponse';

export default class SpellsServices extends ValidateEntry implements Service<Internacional<Spell>> {
    constructor(
        private readonly _model: SpellsModel,
        private readonly _logger: LoggerType
    ) {
        super();
    }

    public async findAll(): Promise<Array<Internacional<Spell>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All spell entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Spell>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All spell entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Spell>> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a spell with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Spell entity found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Spell>): Promise<Internacional<Spell>> {
        this.validate(languagesWrapper(spellsZodSchema), payload);

        if (payload.active) {
            const err = new Error('Not authorized to change availability');
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            throw err;
        }

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a spell with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        this._logger('info', 'Spell entity updated with success');
        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a spell with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            throw err;
        }

        if (response.active === query) {
            const err = new Error(`${query ? 'Entity already enabled' : 'Entity already disabled'}`);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            throw err;
        }

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Spell ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };
        return responseMessage;
    }
}
