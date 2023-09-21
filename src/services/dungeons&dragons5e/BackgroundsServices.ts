import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import { Logger } from 'src/types/Logger';
import ValidateData from 'src/support/helpers/ValidateData';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import UpdateResponse from 'src/types/UpdateResponse';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { SchemasDnDType } from 'src/schemas';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import getErrorName from 'src/support/helpers/getErrorName';

export default class BackgroundsServices implements Service<Internacional<Background>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Background>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
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
        const response = await this._model.findOne(_id);

        this._logger('info', 'Background entity found with success');
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return response;
    }

    public async update(_id: string, payload: Internacional<Background>): Promise<Internacional<Background>> {
        const { helpers, backgroundZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(backgroundZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);

        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        this._logger('info', 'Background entity updated with success');

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
            message: `Background ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Background availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
