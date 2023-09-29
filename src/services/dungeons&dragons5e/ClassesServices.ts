import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import UpdateResponse from 'src/types/UpdateResponse';
import { Logger } from 'src/types/Logger';
import ValidateData from 'src/services/helpers/ValidateData';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { SchemasDnDType } from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import getErrorName from 'src/services/helpers/getErrorName';

export default class ClassesServices implements Service<Internacional<Class>> {
    constructor(
        private readonly _model: MongoModel<Internacional<Class>>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<Array<Internacional<Class>>> {
        const response = await this._model.findAll({ active: true });

        this._logger('info', 'All class entities found with success');
        return response;
    }

    public async findAllDisabled(): Promise<Array<Internacional<Class>>> {
        const response = await this._model.findAll({ active: false });

        this._logger('info', 'All class entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<Internacional<Class>> {
        const response = await this._model.findOne(_id);

        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        this._logger('info', 'Class entity found with success');
        return response;
    }

    public async update(_id: string, payload: Internacional<Class>): Promise<Internacional<Class>> {
        const { helpers, classZod } = this._schema;
        this._validate.entry(helpers.languagesWrapperSchema(classZod), payload);

        this._validate.existance(payload.active, ErrorMessage.BAD_REQUEST);

        const updatedResponse = await this._model.update(_id, payload);

        if (!updatedResponse)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        this._logger('info', 'Class entity updated with success');
        return updatedResponse;
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
            message: `Class ${response._id as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `Class availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
