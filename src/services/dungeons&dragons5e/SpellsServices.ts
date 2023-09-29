import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import UpdateResponse from 'src/types/UpdateResponse';
import ValidateData from 'src/services/helpers/ValidateData';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { SchemasDnDType } from 'src/schemas';
import { Spell } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import getErrorName from 'src/services/helpers/getErrorName';

export default class SpellsServices implements Service<Internacional<Spell>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Spell>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

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

        this._logger('info', 'Spell entity found with success');
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return response;
    }

    public async update(_id: string, payload: Internacional<Spell>): Promise<Internacional<Spell>> {
        const { helpers, spellZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(spellZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Spell entity updated with success');
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Spell ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Spell availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
