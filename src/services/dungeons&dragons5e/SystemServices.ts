import { DnDSystem, MongoModel, SchemasDnDType, UpdateContent, SystemContent } from '@tablerise/database-management';
import Service from 'src/types/Service';
import ValidateData from 'src/support/helpers/ValidateData';
import { Logger } from 'src/types/Logger';
import { errorMessage } from 'src/support/helpers/errorMessage';
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
        return this._validate.systemResponse(response, errorMessage.notFound.system);
    }

    public async update(_id: string, payload: DnDSystem): Promise<DnDSystem> {
        const { systemZod } = this._schema;
        this._validate.entry(systemZod, payload);

        this._validate.systemActive(payload.content, HttpStatusCode.FORBIDDEN, errorMessage.forbidden);

        const response = await this._model.update(_id, payload);

        this._logger('info', 'System entity updated with success');
        return this._validate.systemResponse(response, errorMessage.notFound.system);
    }

    public async updateContent(_id: string, entityQuery: string, payload: UpdateContent): Promise<string> {
        const { updateContentZodSchema } = this._schema;
        this._validate.entry(updateContentZodSchema, payload);

        this._validate.systemEntityQuery(entityQuery, errorMessage.unprocessableEntity);

        const { method, newID } = payload;

        let recoverSystem = (await this._model.findOne(_id)) as DnDSystem & { _id: string };

        recoverSystem = this._validate.systemResponse(recoverSystem, errorMessage.notFound.system);

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

    public async activate(_id: string): Promise<string> {
        let response = (await this._model.findOne(_id)) as DnDSystem & { _id: string };
        response = this._validate.systemResponse(response, errorMessage.notFound.system);

        this._validate.systemActive(
            response.active,
            HttpStatusCode.BAD_REQUEST,
            errorMessage.badRequest.system.responseActive(response.active as boolean)
        );

        response.active = true;

        await this._model.update(_id, response);

        this._logger('info', 'System entity activated with success');
        return `System ${response._id} was activated`;
    }

    public async deactivate(_id: string): Promise<string> {
        let response = (await this._model.findOne(_id)) as DnDSystem & { _id: string };
        response = this._validate.systemResponse(response, errorMessage.notFound.system);

        this._validate.systemActive(
            !response.active,
            HttpStatusCode.BAD_REQUEST,
            errorMessage.badRequest.system.responseActive(response.active as boolean)
        );

        response.active = false;

        await this._model.update(_id, response);

        this._logger('info', 'System entity deactivated with success');
        return `System ${response._id} was deactivated`;
    }
}
