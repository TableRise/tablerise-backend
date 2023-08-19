import SystemModel from 'src/database/models/SystemModel';
import Service from 'src/types/Service';
import { System, SystemContent, systemPayloadZodSchema } from 'src/schemas/systemValidationSchema';
import ValidateData from 'src/support/helpers/ValidateData';
import updateContentZodSchema, { UpdateContent } from 'src/schemas/updateContentSchema';
import { LoggerType } from 'src/types/LoggerType';
import { ErrorMessage } from 'src/support/helpers/errorMessage';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default class SystemServices implements Service<System> {
    constructor(
        private readonly _model: SystemModel,
        private readonly _logger: LoggerType,
        private readonly _validate: ValidateData
    ) {}

    public async findAll(): Promise<System[]> {
        const response = await this._model.findAll();

        this._logger('info', 'All system entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<System> {
        const response = await this._model.findOne(_id);

        this._logger('info', 'System entity found with success');
        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        return response;
    }

    public async update(_id: string, payload: System): Promise<System> {
        this._validate.entry(systemPayloadZodSchema, payload);
        this._validate.existance(!!payload.content, ErrorMessage.BAD_REQUEST);

        const response = await this._model.update(_id, payload);
        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }
        this._logger('info', 'System entity updated with success');

        return response;
    }

    public async updateContent(_id: string, entityQuery: string, payload: UpdateContent): Promise<string> {
        this._validate.entry(updateContentZodSchema, payload);

        this._validate.existance(!entityQuery, ErrorMessage.BAD_REQUEST);

        const { method, newID } = payload;

        const recoverSystem = await this._model.findOne(_id);

        if (!recoverSystem) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        if (recoverSystem && method === 'add') {
            recoverSystem.content[entityQuery as keyof SystemContent].push(newID);
        }

        if (recoverSystem && method === 'remove') {
            const removeIdFromContent = recoverSystem.content[entityQuery as keyof SystemContent].filter(
                (id) => id !== newID
            );

            recoverSystem.content[entityQuery as keyof SystemContent] = removeIdFromContent;
        }

        await this._model.update(_id, recoverSystem);

        const response = `New ID ${newID} was ${method} to array of entities ${entityQuery} - system ID: ${
            recoverSystem._id as string
        }`;

        this._logger('info', 'Content of the system entity updated with success');
        return response;
    }

    public async activate(_id: string): Promise<string> {
        const response = await this._model.findOne(_id);
        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        this._validate.existance(response.active, ErrorMessage.BAD_REQUEST);

        response.active = true;
        await this._model.update(_id, response);

        this._logger('info', 'System entity activated with success');
        return `System ${response._id as string} was activated`;
    }

    public async deactivate(_id: string): Promise<string> {
        const response = await this._model.findOne(_id);

        if (!response) {
            throw this._validate._generateError(HttpStatusCode.NOT_FOUND, ErrorMessage.NOT_FOUND_BY_ID);
        }

        this._validate.existance(!response.active, ErrorMessage.BAD_REQUEST);

        response.active = true;
        await this._model.update(_id, response);

        this._logger('info', 'System entity deactivated with success');
        return `System ${response._id as string} was deactivated`;
    }
}
