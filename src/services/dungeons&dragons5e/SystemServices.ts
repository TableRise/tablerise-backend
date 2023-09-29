import { MongoModel } from '@tablerise/database-management';
import Service from 'src/types/Service';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/services/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { SchemasDnDType } from 'src/schemas';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import getErrorName from 'src/services/helpers/getErrorName';

export default class SystemServices implements Service<System> {
    constructor(
        private readonly _model: MongoModel<System>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<System[]> {
        const response = await this._model.findAll();

        this._logger('info', 'All system entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<System> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'System entity found with success');
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return response;
    }

    public async update(_id: string, payload: any): Promise<System> {
        const { systemZod } = this._schema;
        this._validate.entry(systemZod.systemPayloadZodSchema, payload);
        this._validate.existance(!!payload.content, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);
        if (!response)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        this._logger('info', 'System entity updated with success');

        return response;
    }

    public async updateContent(_id: string, entityQuery: string, payload: any): Promise<string> {
        const { updateContentZodSchema } = this._schema;

        this._validate.entry(updateContentZodSchema, payload);
        this._validate.existance(!entityQuery, ErrorMessage.BAD_REQUEST);

        const { method, newID } = payload as UpdateContent;

        const recoverSystem = (await this._model.findOne(_id)) as System & { _id: string };

        if (!recoverSystem)
            throw new HttpRequestErrors({
                message: ErrorMessage.NOT_FOUND_BY_ID,
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        if (recoverSystem && method === 'add') {
            // @ts-expect-error => The SystemContent is possible undefined when import from lib but will never be undefined
            recoverSystem.content[entityQuery as keyof SystemContent].push(newID);
        }

        if (recoverSystem && method === 'remove') {
            // @ts-expect-error => The SystemContent is possible undefined when import from lib but will never be undefined
            const removeIdFromContent = recoverSystem.content[entityQuery as keyof SystemContent].filter(
                (id: string) => id !== newID
            );

            // @ts-expect-error => The SystemContent is possible undefined when import from lib but will never be undefined
            recoverSystem.content[entityQuery as keyof SystemContent] = removeIdFromContent;
        }

        await this._model.update(_id, recoverSystem);

        const response = `New ID ${newID} was ${method as string} to array of entities ${entityQuery} - system ID: ${
            recoverSystem._id
        }`;

        this._logger('info', 'Content of the system entity updated with success');
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
            message: `System ${_id} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `System availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
