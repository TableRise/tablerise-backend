import SystemModel from 'src/database/models/SystemModel';
import Service from 'src/types/Service';
import systemZodSchema, { System, SystemContent } from 'src/schemas/systemValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import ValidateEntry from 'src/support/helpers/ValidateEntry';
import updateContentZodSchema, { UpdateContent } from 'src/schemas/updateContentSchema';
import { LoggerType } from 'src/types/LoggerType';

export default class SystemServices extends ValidateEntry implements Service<System> {
    constructor(
        private readonly _model: SystemModel,
        private readonly _logger: LoggerType
    ) {
        super();
    }

    public async findAll(): Promise<System[]> {
        const response = await this._model.findAll();

        this._logger('success', 'All system entities found with success');
        return response;
    }

    public async findOne(_id: string): Promise<System> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a system with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';
        
            this._logger('error', err.message);
            throw err;
        }

        this._logger('success', 'System entity found with success');
        return response;
    }

    public async update(_id: string, payload: System): Promise<System> {
        this.validate(systemZodSchema, payload);

        if (payload.content) {
            const err = new Error('Update the content directly is not allowed');
            err.stack = HttpStatusCode.FORBIDDEN.toString();
            err.name = 'ForbiddenRequest';

            this._logger('error', err.message);
            throw err;
        }

        const response = await this._model.update(_id, payload);

        if (!response) {
            const err = new Error('NotFound a system with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';
        
            this._logger('error', err.message);
            throw err;
        }

        this._logger('success', 'System entity updated with success');
        return response;
    }

    public async updateContent(_id: string, entityQuery: string, payload: UpdateContent): Promise<string> {
        this.validate(updateContentZodSchema, payload);

        if (!entityQuery) {
            const err = new Error('An entity name is required');
            err.stack = HttpStatusCode.UNPROCESSABLE_ENTITY.toString();
            err.name = 'ValidationError';

            this._logger('error', err.message);
            throw err;
        }

        const { method, newID } = payload;

        const recoverSystem = await this._model.findOne(_id);

        if (!recoverSystem) {
            const err = new Error('NotFound a system with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        if (method === 'add') {
            recoverSystem.content[entityQuery as keyof SystemContent].push(newID);
        }

        if (method === 'remove') {
            const removeIdFromContent = recoverSystem.content[entityQuery as keyof SystemContent].filter(
                (id) => id !== newID
            );

            recoverSystem.content[entityQuery as keyof SystemContent] = removeIdFromContent;
        }

        await this._model.update(_id, recoverSystem);

        const response = `New ID ${newID} was ${method} to array of entities ${entityQuery} - system ID: ${
            recoverSystem._id as string
        }`;

        this._logger('success', 'Content of the system entity updated with success');
        return response;
    }

    public async activate(_id: string): Promise<string> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a system with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        if (response.active) {
            const err = new Error('System already active');
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'ValidationError';

            this._logger('error', err.message);
            throw err;
        }

        response.active = true;

        await this._model.update(_id, response);

        this._logger('success', 'System entity activated with success');
        return `System ${response._id as string} was activated`;
    }

    public async deactivate(_id: string): Promise<string> {
        const response = await this._model.findOne(_id);

        if (!response) {
            const err = new Error('NotFound a system with provided ID');
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';

            this._logger('error', err.message);
            throw err;
        }

        if (!response.active) {
            const err = new Error('System already deactivated');
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'ValidationError';

            this._logger('error', err.message);
            throw err;
        }

        response.active = false;

        await this._model.update(_id, response);

        this._logger('success', 'System entity deactivated with success');
        return `System ${response._id as string} was deactivated`;
    }
}
