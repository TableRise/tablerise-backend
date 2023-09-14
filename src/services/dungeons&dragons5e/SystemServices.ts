import { DnDSystem, MongoModel, SchemasDnDType, UpdateContent, SystemContent } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import UpdateResponse from 'src/types/UpdateResponse';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default class SystemServices implements Service<DnDSystem> {
    constructor(
        private readonly _model: MongoModel<DnDSystem>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasDnDType
    ) {}

    public async findAll(): Promise<DnDSystem[]> {
        const response = await this._model.findAll();

        this._logger('info', 'All system entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<DnDSystem> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'System entity found with success');
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        return response;
    }

    public async update(_id: string, payload: any): Promise<DnDSystem> {
        const { systemZod } = this._schema;
        this._validate.entry(systemZod.systemPayloadZodSchema, payload);
        this._validate.existance(!!payload.content, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);
        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        this._logger('info', 'System entity updated with success');

        return response;
    }

    public async updateContent(_id: string, entityQuery: string, payload: any): Promise<string> {
        const { updateContentZodSchema } = this._schema;

        this._validate.entry(updateContentZodSchema, payload);
        this._validate.existance(!entityQuery, ErrorMessage.BAD_REQUEST);

        const { method, newID } = payload as UpdateContent;

        const recoverSystem = (await this._model.findOne(_id)) as DnDSystem & { _id: string };

        if (!recoverSystem) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        if (recoverSystem && method === 'add') {
            // @ts-expect-error => The SystemContent is possible undefined when import from lib but will never be undefined
            recoverSystem.content[entityQuery as keyof SystemContent].push(newID as string);
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

        const response = `New ID ${newID as string} was ${
            method as string
        } to array of entities ${entityQuery} - system ID: ${recoverSystem._id}`;

        this._logger('info', 'Content of the system entity updated with success');
        return response;
    }

    public async updateAvailability(_id: string, query: boolean): Promise<UpdateResponse> {
        const response = await this._model.findOne(_id);

        if (!response) throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);

        this._validate.existance(response.active === query, ErrorMessage.BAD_REQUEST);

        response.active = query;
        await this._model.update(_id, response);

        const responseMessage = {
            message: `System ${response.name as string} was ${query ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        this._logger('info', `System availability ${query ? 'activated' : 'deactivated'} with success`);
        return responseMessage;
    }
}
