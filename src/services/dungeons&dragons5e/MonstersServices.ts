import { DnDMonster, MongoModel, Internacional, SchemasDnDType } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default class MonstersService implements Service<Internacional<DnDMonster>> {
    constructor(
        private readonly _model: MongoModel<Internacional<DnDMonster>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<DnDMonster>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All monster entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<DnDMonster>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Monster entity found with success');
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<DnDMonster>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All Monster entities found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<DnDMonster>): Promise<Internacional<DnDMonster>> {
        const { helpers, monsterZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(monsterZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Monster entity updated with success');
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
            message: `Monster ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', 'Monster entity availability updated with success');
        return responseMessage;
    }
}
