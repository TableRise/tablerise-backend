import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { SchemasDnDType } from 'src/schemas';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

export default class MonstersService implements Service<Internacional<Monster>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Monster>>,
        private readonly _logger: Logger,
        private readonly _validate: SchemaValidator,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Monster>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All monster entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Monster>> {
        const response = (await this._model.findOne(_id)) as Internacional<Monster>;

        this._logger('info', 'Monster entity found with success');
        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Monster>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All Monster entities found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Monster>): Promise<Internacional<Monster>> {
        const { helpers, monsterZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(monsterZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = (await this._model.update(_id, payload)) as Internacional<Monster>;

        this._logger('info', 'Monster entity updated with success');
        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = (await this._model.findOne(_id)) as Internacional<Monster>;

        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Monster ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Monster entity availability updated with success');
        return responseMessage;
    }
}
