import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { SchemasDnDType } from 'src/schemas';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

export default class RealmsServices implements Service<Internacional<Realm>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Realm>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Realm>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All realm entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Realm>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All realm entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Realm>> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'Realm entity found with success');
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        return response;
    }

    public async update(_id: string, payload: Internacional<Realm>): Promise<Internacional<Realm>> {
        const { helpers, realmZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(realmZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'Realm entity updated with success');
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
            message: `Realm ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Realm availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
