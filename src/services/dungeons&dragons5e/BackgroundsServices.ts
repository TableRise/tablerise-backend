import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { SchemasDnDType } from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

export default class BackgroundsServices implements Service<Internacional<Background>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Background>>,
        private readonly _logger: Logger,
        private readonly _validate: SchemaValidator,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Background>>> {
        const response = await this._model.findAll();

        this._logger('info', 'All background entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Background>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All background entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Background>> {
        const response = (await this._model.findOne(_id)) as Internacional<Background>;

        this._logger('info', 'Background entity found with success');
        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        return response;
    }

    public async update(_id: string, payload: Internacional<Background>): Promise<Internacional<Background>> {
        const { helpers, backgroundZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(backgroundZod), payload);
        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = (await this._model.update(_id, payload)) as Internacional<Background>;

        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');
        this._logger('info', 'Background entity updated with success');

        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = (await this._model.findOne(_id)) as Internacional<Background>;

        if (!response) HttpRequestErrors.throwError('rpg-not-found-id');

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `Background ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Background availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
